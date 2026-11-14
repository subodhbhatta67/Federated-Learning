from flask import Flask, jsonify
from flask_cors import CORS
from routes.results import results_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(results_bp)

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)