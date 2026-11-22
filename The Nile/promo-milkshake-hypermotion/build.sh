#!/usr/bin/env bash
# Builds the final promo: Higgsfield Hypermotion clip -> cross-fade -> end card (original photo + code text) -> cross-fade back to the first frame, so it loops.
# Needs: node + playwright (for the end-card frames) and ffmpeg.   Usage: ./build.sh
set -euo pipefail
cd "$(dirname "$0")"
AI=higgsfield/coral-burst-splash-raw.mp4
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
EC_DUR=4.4; FADE=0.5
AI_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AI")
node capture-endcard.js "$PWD/endcard.html" "$TMP" frames 24 "$EC_DUR"
ffmpeg -v error -y -i "$AI" -frames:v 1 -vf scale=1080:1920:flags=lanczos "$TMP/first.png"
O1=$(echo "$AI_DUR - $FADE" | bc -l)
# pass 1: AI clip -> end card (lossless intermediate)
ffmpeg -v error -y -i "$AI" -framerate 24 -i "$TMP/%05d.jpg" -filter_complex \
 "[0:v]scale=1080:1920:flags=lanczos,fps=24,setsar=1,format=yuv420p,settb=1/24[a];[1:v]setsar=1,format=yuv420p,settb=1/24[e];[a][e]xfade=transition=fade:duration=$FADE:offset=$O1[v]" \
 -map "[v]" -an -c:v libx264 -qp 0 -preset ultrafast "$TMP/pass1.mp4"
# pass 2: fade the end back into the clip's first frame, ending exactly on it so the loop is seamless
P1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/pass1.mp4")
O2=$(echo "$P1 - $FADE" | bc -l); NF=$(printf '%.0f' "$(echo "$P1*24" | bc -l)")
ffmpeg -v error -y -i "$TMP/pass1.mp4" -loop 1 -t 1 -framerate 24 -i "$TMP/first.png" -filter_complex \
 "[0:v]settb=1/24[p];[1:v]fps=24,setsar=1,format=yuv420p,settb=1/24[f];[p][f]xfade=transition=fade:duration=$FADE:offset=$O2,trim=end_frame=$NF[v]" \
 -map "[v]" -an -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -movflags +faststart output/the-nile-strawberry-millions-milkshake-1080x1920.mp4
echo "done: output/the-nile-strawberry-millions-milkshake-1080x1920.mp4"
