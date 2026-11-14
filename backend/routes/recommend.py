from flask import Blueprint, jsonify, request
from data_loader import STRATEGIES, alpha_key, load_result

recommend_bp = Blueprint("recommend", __name__)

NAMES = {"fedavg": "FedAvg", "fedprox": "FedProx",
         "fedadam": "FedAdam", "scaffold": "SCAFFOLD"}
COMMUNICATION = {"fedavg": "1x", "fedprox": "1x",
                 "fedadam": "1x", "scaffold": "about 2x"}
PRIORITIES = {"accuracy", "fairness", "cost"}


def summarize(strategy, alpha):
    """Final-round numbers for one strategy, or None if there is no file."""
    result = load_result(strategy, alpha)
    if result is None:
        return None
    rounds = result["rounds"]
    jfi_values = [r["jfi"] for r in rounds if r.get("jfi") is not None]
    return {
        "strategy": NAMES[strategy],
        "accuracy": rounds[-1].get("accuracy"),
        "jfi": rounds[-1].get("jfi"),
        "avg_jfi": sum(jfi_values) / len(jfi_values) if jfi_values else None,
        "communication": COMMUNICATION[strategy],
    }


def score(row, priority):
    """Higher is better. Missing values count as -1 so they rank last."""
    accuracy = row["accuracy"] if row["accuracy"] is not None else -1
    avg_jfi = row["avg_jfi"] if row["avg_jfi"] is not None else -1
    if priority == "fairness":
        return (avg_jfi, accuracy)
    if priority == "cost":
        return (1 if row["communication"] == "1x" else 0, accuracy)
    return (accuracy,)


@recommend_bp.route("/api/recommend", methods=["POST"])
def recommend():
    body = request.get_json(silent=True) or {}
    alpha = alpha_key(body.get("alpha"))
    priority = body.get("priority")

    if alpha is None or priority not in PRIORITIES:
        return jsonify({"error": "invalid alpha or priority"}), 400

    rows = [summarize(s, alpha) for s in STRATEGIES]
    rows = [r for r in rows if r is not None]
    if not rows:
        return jsonify({"error": "no data for this alpha yet"}), 404

    rows.sort(key=lambda r: score(r, priority), reverse=True)

    reasons = {
        "accuracy": "Highest final accuracy",
        "fairness": "Highest average fairness (Jain's index) across rounds",
        "cost": "Lowest communication cost, then highest accuracy",
    }
    table = [{"strategy": r["strategy"], "accuracy": r["accuracy"],
              "jfi": r["jfi"], "communication": r["communication"]}
             for r in rows]

    return jsonify({
        "recommended": rows[0]["strategy"],
        "reason": f"{reasons[priority]} among strategies with data at alpha {alpha}.",
        "runner_up": rows[1]["strategy"] if len(rows) > 1 else None,
        "table": table,
    })