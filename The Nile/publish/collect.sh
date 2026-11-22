#!/usr/bin/env bash
# Copies ONLY the files the live menu screens need into a folder for GitHub Pages.
# Used by .github/workflows/publish-menu-screens.yml; can also be run by hand.
# Usage (from the repository root): "The Nile/publish/collect.sh" <output folder>
set -euo pipefail
SRC="The Nile"; ROOT="$1"; OUT="$ROOT/The Nile"
rm -rf "$ROOT"; mkdir -p "$OUT/menu-style2/fonts" "$OUT/fonts" "$OUT/assets" "$OUT/promo-v2/images"
cp "$SRC"/screen1.html "$SRC"/screen2.html "$SRC"/screen3.html "$SRC"/board.css "$SRC"/board.js "$SRC"/menu-data.js "$OUT/"
cp "$SRC"/menu-style2/style2.css "$SRC"/menu-style2/decor.js "$SRC"/menu-style2/layout.js "$OUT/menu-style2/"
cp "$SRC"/menu-style2/fonts/*.woff2 "$OUT/menu-style2/fonts/"
cp "$SRC"/fonts/*.woff2 "$OUT/fonts/"
cp "$SRC"/assets/triangle.png "$SRC"/assets/background-logo-orange.jpg "$SRC"/assets/logo.png "$OUT/assets/"
cp "$SRC"/promo-v2/images/logo-triangle-dark.png "$SRC"/promo-v2/images/flame-small.png "$OUT/promo-v2/images/"
cp "$SRC/publish/index.html" "$OUT/index.html"
cp "$SRC/publish/site-root-index.html" "$ROOT/index.html"
touch "$ROOT/.nojekyll"
echo "collected $(find "$ROOT" -type f | wc -l) files into $ROOT"
