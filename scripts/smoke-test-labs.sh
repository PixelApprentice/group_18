#!/usr/bin/env bash
set -euo pipefail
base=${1:-http://localhost}
echo "Checking SQLi lab..."
curl -sSf "$base/lab/sql-injection/health" || echo "SQLi lab health check failed" && true
echo "Checking XSS lab..."
curl -sSf "$base/lab/xss-stored/health" || echo "XSS lab health check failed" && true
echo "Checking Broken Auth lab..."
curl -sSf "$base/lab/broken-auth/health" || echo "Broken Auth lab health check failed" && true
echo "Checking IDOR lab..."
curl -sSf "$base/lab/idor/health" || echo "IDOR lab health check failed" && true

echo "Done"
