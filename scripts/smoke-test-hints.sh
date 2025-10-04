#!/usr/bin/env bash
set -euo pipefail
base=${1:-http://localhost}
echo "Running hint smoke tests against $base"

echo "Testing SQLi hint..."
if curl -sG --data-urlencode "q=' OR '1'='1" "$base/lab/sql-injection/search" | grep -q "SUCCESS: You triggered the injection"; then
  echo "SQLi hint PASS"
else
  echo "SQLi hint FAIL"; exit 2
fi

echo "Testing XSS hint..."
if curl -s -L -X POST -d "author=smoke&content=<script>console.log('s')</script>" "$base/lab/xss-stored/comment" | grep -q "SUCCESS: Your comment contained"; then
  echo "XSS hint PASS"
else
  echo "XSS hint FAIL"; exit 2
fi

echo "Testing Broken Auth hint..."
if curl -s -L -X POST -d "username=victim&password=guessme" "$base/lab/broken-auth/login" | grep -q "SUCCESS: Login accepted"; then
  echo "Broken Auth hint PASS"
else
  echo "Broken Auth hint FAIL"; exit 2
fi

echo "Testing IDOR hint..."
if curl -s -L "$base/lab/idor/note/3" | grep -q "SUCCESS: You viewed a note"; then
  echo "IDOR hint PASS"
else
  echo "IDOR hint FAIL"; exit 2
fi

echo "All hint smoke tests passed"
