import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
STRATEGIES = ["fedavg", "fedprox", "fedadam", "scaffold"]
ALPHAS = {"100", "1.0", "0.5", "0.1"}


def alpha_key(value):
    """Turn 0.5, "0.5", 1, 1.0, 100 ... into one of the file keys, or None."""
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return {100.0: "100", 1.0: "1.0", 0.5: "0.5", 0.1: "0.1"}.get(number)


def load_result(strategy, alpha):
    """Return the parsed JSON for one strategy and alpha, or None."""
    if strategy not in STRATEGIES or alpha not in ALPHAS:
        return None
    path = os.path.join(DATA_DIR, f"{strategy}_alpha{alpha}.json")
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)