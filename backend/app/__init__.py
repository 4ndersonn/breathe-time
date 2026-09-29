import os

from flask import Flask, jsonify
from flask_cors import CORS

from backend.app.api.routes import api_bp
from backend.app.domain.models import DatasetNotFoundError


def create_app():
    app = Flask(__name__)

    cors_origins = os.getenv("CORS_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    app.register_blueprint(api_bp)

    @app.errorhandler(DatasetNotFoundError)
    def handle_dataset_not_found(error):
        return jsonify({
            "error": str(error),
            "status": "error",
            "code": 503
        }), 503

    @app.errorhandler(500)
    def handle_internal_error(error):
        return jsonify({
            "error": "Erro interno no servidor.",
            "status": "error",
            "code": 500
        }), 500

    return app

if __name__ == "__main__":
    app = create_app()
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)
