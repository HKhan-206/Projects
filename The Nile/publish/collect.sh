#!/usr/bin/env bash
# Copies ONLY the files the live menu screens and the promo screen need into a folder for GitHub Pages.
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
# promo screen (promo-v2/index.html)
mkdir -p "$OUT/promo-v2/vendor" "$OUT/promo-v2/fonts" "$OUT/promo-v2/images/items"
cp "$SRC"/promo-v2/index.html "$SRC"/promo-v2/promo-v2.css "$SRC"/promo-v2/promo-v2.js "$SRC"/promo-v2/items.js "$OUT/promo-v2/"
cp "$SRC"/promo-v2/vendor/gsap.min.js "$OUT/promo-v2/vendor/"
cp "$SRC"/promo-v2/fonts/*.woff2 "$OUT/promo-v2/fonts/"
cp "$SRC"/promo-v2/images/items/*.jpg "$OUT/promo-v2/images/items/"
cp "$SRC"/promo-v2/images/logo-stacked.png "$SRC"/promo-v2/images/logo-triangle.png "$SRC"/promo-v2/images/cheese-drip.webm "$OUT/promo-v2/images/"
mkdir -p "$OUT/promo-v2/videos"
cp "$SRC"/promo-v2/videos/*.mp4 "$SRC"/promo-v2/videos/*.webm "$OUT/promo-v2/videos/"
cp "$SRC/publish/index.html" "$OUT/index.html"
cp "$SRC/publish/site-root-index.html" "$ROOT/index.html"
touch "$ROOT/.nojekyll"
echo "collected $(find "$ROOT" -type f | wc -l) files into $ROOT"
