#!/usr/bin/env bash
# Final poster clip (v3): single 14 s Kling 4.0 clip -> 0.8 s dissolve back to the opening frame so it loops seamlessly.
# Silent, 1080x1920, 24 fps.
set -euo pipefail
cd "$(dirname "$0")"
MAIN=output/kling4-v3-raw.mp4; START=source/poster-9x16-start-frame.png
OUT=output/the-nile-strawberry-millions-milkshake-poster-1080x1920.mp4
F2=0.8
DM=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MAIN")
O2=$(echo "$DM - $F2" | bc -l); NF=$(printf '%.0f' "$(echo "$DM*24" | bc -l)")
ffmpeg -v error -y -i "$MAIN" -loop 1 -t 2 -framerate 24 -i "$START" -filter_complex \
 "[0:v]fps=24,setsar=1,format=yuv420p,settb=1/24[p];[1:v]fps=24,scale=1080:1920,setsar=1,format=yuv420p,settb=1/24[s];[p][s]xfade=transition=fade:duration=$F2:offset=$O2,trim=end_frame=$NF[v]" \
 -map "[v]" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT"
echo "done: $OUT"
