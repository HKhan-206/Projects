#!/usr/bin/env bash
# Final poster clip: Kling 4.0 clip -> 0.25 s blend into the exact poster -> 2 s hold -> 0.8 s dissolve back to the opening frame (seamless loop). Silent.
set -euo pipefail
cd "$(dirname "$0")"
RAW=output/kling4-raw.mp4; END=source/poster-9x16-final-frame.png; START=source/poster-9x16-start-frame.png
OUT=output/the-nile-strawberry-millions-milkshake-poster-1080x1920.mp4
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
F1=0.25; HOLD=2.0; F2=0.8
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$RAW")
O1=$(echo "$D - $F1" | bc -l)
ffmpeg -v error -y -i "$RAW" -loop 1 -t $(echo "$F1 + $HOLD + $F2" | bc -l) -framerate 24 -i "$END" -filter_complex \
 "[0:v]fps=24,setsar=1,format=yuv420p,settb=1/24[a];[1:v]fps=24,scale=1080:1920,setsar=1,format=yuv420p,settb=1/24[e];[a][e]xfade=transition=fade:duration=$F1:offset=$O1[v]" \
 -map "[v]" -an -c:v libx264 -qp 0 -preset ultrafast "$TMP/p1.mp4"
P1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/p1.mp4")
O2=$(echo "$P1 - $F2" | bc -l); NF=$(printf '%.0f' "$(echo "$P1*24" | bc -l)")
ffmpeg -v error -y -i "$TMP/p1.mp4" -loop 1 -t 2 -framerate 24 -i "$START" -filter_complex \
 "[0:v]settb=1/24[p];[1:v]fps=24,scale=1080:1920,setsar=1,format=yuv420p,settb=1/24[s];[p][s]xfade=transition=fade:duration=$F2:offset=$O2,trim=end_frame=$NF[v]" \
 -map "[v]" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT"
echo "done: $OUT"
