#!/usr/bin/env bash

set -euo pipefail

origin_url="https://github.com/georgvs/cursor-date-fns.git"
upstream_url="https://github.com/date-fns/date-fns.git"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: run this script inside a git repository."
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "${origin_url}"
else
  git remote add origin "${origin_url}"
fi

if git remote get-url upstream >/dev/null 2>&1; then
  git remote set-url upstream "${upstream_url}"
else
  git remote add upstream "${upstream_url}"
fi

git remote set-url --push upstream DISABLE
git fetch upstream main --tags

echo "Configured remotes:"
git remote -v
