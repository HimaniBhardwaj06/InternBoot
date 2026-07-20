#!/usr/bin/env bash

set -o errexit

echo "========== BUILD STARTED =========="

pip install -r requirements.txt

python3 manage.py collectstatic --noinput --verbosity 2

python3 manage.py migrate

echo "========== BUILD FINISHED =========="