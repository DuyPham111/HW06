#!/usr/bin/env bash
# create-github-issues.sh — tao issue that tren GitHub tu bug-report/issues/BUG-XX.md
# (da soan san title + noi dung). Chi tao TEXT - anh minh hoa van phai anh tu tay them sau
# (GitHub API khong ho tro upload anh qua CLI, chi qua keo-tha tren web).
#
# Chay: bash tools/create-github-issues.sh
set -uo pipefail
export PATH="/c/Program Files/GitHub CLI:$PATH"

REPO="DuyPham111/HW06"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/bug-report/issues/created.txt"
: > "$OUT"

for f in "$ROOT"/bug-report/issues/BUG-*.md; do
  base=$(basename "$f")
  num="${base#BUG-}"; num="${num%.md}"
  if [ "$num" = "19" ]; then
    echo "BUG-19 da tao tay o issue #1 - bo qua"
    echo "BUG-19  https://github.com/DuyPham111/HW06/issues/1" >> "$OUT"
    continue
  fi

  title=$(grep -m1 '^# ' "$f" | sed 's/^# //')
  level=$(grep -oiE '\[(Critical|High|Medium|Low)\]' "$f" | head -1 | tr -d '[]' | tr 'A-Z' 'a-z')
  api=$(grep -oiE '\[API-0[123]\]' "$f" | head -1 | tr -d '[]' | tr 'A-Z' 'a-z')

  # noi dung: bo dong H1 va dong huong dan in nghieng (dong 3)
  body=$(tail -n +5 "$f")

  echo "Tao BUG-$num: $title [$level][$api]"
  url=$(gh issue create --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    --label "bug" --label "$level" --label "$api" 2>&1)

  if [[ "$url" == https://* ]]; then
    echo "  -> $url"
    echo "BUG-$num  $url" >> "$OUT"
  else
    echo "  !! LOI: $url"
    echo "BUG-$num  LOI: $url" >> "$OUT"
  fi
done

echo
echo "Xong. Danh sach issue: $OUT"
