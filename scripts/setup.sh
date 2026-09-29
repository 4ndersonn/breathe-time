#!/usr/bin/env bash
set -e

echo "Criando ambiente virtual Python (venv)..."
python3 -m venv venv

echo "Ativando ambiente virtual e instalando dependências..."
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

echo ""
echo "Setup concluído com sucesso!"
echo "Para rodar a API Flask localmente, execute:"
echo "  source venv/bin/activate"
echo "  python run.py"
