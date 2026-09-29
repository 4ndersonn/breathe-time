from flask import Blueprint, jsonify, request

from backend.app.use_cases.data_service import DataService

api_bp = Blueprint("api", __name__, url_prefix="/api")
data_service = DataService()

@api_bp.route("/domicilios", methods=["GET"])
def get_domicilios():
    pais = request.args.get("pais")
    ano = request.args.get("ano")
    return jsonify(data_service.fetch_domicilios(pais=pais, ano=ano))

@api_bp.route("/suporte-social", methods=["GET"])
def get_suporte_social():
    pais = request.args.get("pais")
    ano = request.args.get("ano")
    return jsonify(data_service.fetch_suporte_social(pais=pais, ano=ano))

@api_bp.route("/tempo-sozinho", methods=["GET"])
def get_tempo_sozinho():
    faixa_etaria_genero = request.args.get("faixa_etaria_genero")
    ano = request.args.get("ano")
    return jsonify(data_service.fetch_tempo_sozinho(
        faixa_etaria_genero=faixa_etaria_genero, ano=ano
    ))
