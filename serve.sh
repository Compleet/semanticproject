#!/usr/bin/env bash
# Simple static server using Python's http.server
PORT=8000
echo "Serving $(pwd) on http://localhost:$PORT"
python3 -m http.server $PORT
