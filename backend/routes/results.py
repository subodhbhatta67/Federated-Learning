import json
import os
from flask import Blueprint, jsonify, request

results_bp = Blueprint("results", __name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

ALLOWED_STRATEGIES = {"fedavg", "fedprox", "fedadam", "scaffold"}
ALLOWED_ALPHAS = {"100", "1.0", "0.5", "0.1"}


@results_bp.route("/api/results")
def get_results():
    alpha = request.args.get("alpha", "")
    names = request.args.get("strategies", "").split(",")

    if alpha not in ALLOWED_ALPHAS:
        return jsonify({"error": "invalid alpha"}), 400

    output = []
    for name in names:
        if name not in ALLOWED_STRATEGIES:
            continue
        path = os.path.join(DATA_DIR, f"{name}_alpha{alpha}.json")
        if os.path.exists(path):
            with open(path) as f:
                output.append(json.load(f))
    return jsonify(output)