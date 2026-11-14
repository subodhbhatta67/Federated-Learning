from flask import Blueprint, jsonify, request
from data_loader import ALPHAS, load_result

results_bp = Blueprint("results", __name__)


@results_bp.route("/api/results")
def get_results():
    alpha = request.args.get("alpha", "")
    names = request.args.get("strategies", "").split(",")

    if alpha not in ALPHAS:
        return jsonify({"error": "invalid alpha"}), 400

    output = []
    for name in names:
        result = load_result(name, alpha)
        if result:
            output.append(result)
    return jsonify(output)