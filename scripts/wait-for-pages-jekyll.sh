#!/usr/bin/env bash
# GitHub Pages also builds this repo from the branch with Jekyll, which publishes
# README.md as the homepage. Whichever deploy finishes last is the live site.
# Wait that build out so the portfolio publish replaces it.
set -eu

sha="${GITHUB_SHA:?}"
repo="${GITHUB_REPOSITORY:?}"
token="${GH_TOKEN:?}"
start=$(date +%s)

echo "Waiting so the README build cannot replace the portfolio."

for i in $(seq 1 40); do
  if ! json=$(curl -fsS \
    -H "Authorization: Bearer ${token}" \
    -H "Accept: application/vnd.github+json" \
    -H "User-Agent: show-case-deploy" \
    "https://api.github.com/repos/${repo}/actions/runs?head_sha=${sha}&per_page=20"); then
    echo "Actions API unavailable."
    json=""
  fi

  state=$(printf '%s' "$json" | python3 -c '
import json, sys
raw = sys.stdin.read().strip()
if not raw:
    print("api-error")
    raise SystemExit
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    print("api-error")
    raise SystemExit
runs = [r for r in data.get("workflow_runs", []) if r.get("name") == "pages build and deployment"]
if not runs:
    print("missing")
else:
    run = runs[0]
    print((run.get("status") or "unknown") + " " + (run.get("conclusion") or ""))
' || true)

  if [ -z "${state}" ]; then
    state=api-error
  fi

  echo "attempt ${i}: ${state}"

  case "$state" in
    completed*)
      echo "Jekyll deploy finished. Pausing so it is live before we replace it."
      sleep 25
      exit 0
      ;;
  esac

  now=$(date +%s)
  if [ "$state" = "missing" ] || [ "$state" = "api-error" ]; then
    if [ $((now - start)) -ge 90 ]; then
      echo "No Jekyll deploy confirmed. Publishing now."
      exit 0
    fi
  fi

  sleep 5
done

echo "Stopped waiting. Publishing the portfolio."
