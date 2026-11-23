#!/usr/bin/env bash
# Rebuilds the kinetic photo edit from the saved sources.
#   1. frame sequences of the two Seedance shots (git-ignored, made from the raw clips)
#   2. renders every frame of index.html (1080x1920, 30 fps) with Playwright
#   3. encodes output/the-nile-kinetic-photo-edit-1080x1920.mp4
set -euo pipefail
cd "$(dirname "$0")"
rm -rf clips/burger clips/pizza && mkdir -p clips/burger clips/pizza
# burger: bun drop (4-11), patty drop (14-27), then from the cheese layer on (36-84);
# frames 28-35 are skipped because the lettuce lands on top of the patty there (it shows underneath later)
ffmpeg -v error -nostdin -i clips/burger-build-raw.mp4 -vf "select='between(n,4,11)+between(n,14,27)+between(n,36,84)',setpts=N/24/TB" -fps_mode passthrough -q:v 1 -qmin 1 clips/burger/%03d.jpg
ffmpeg -v error -nostdin -ss 1.0 -i clips/pizza-pull-raw.mp4 -q:v 1 -qmin 1 clips/pizza/%03d.jpg
FR="${TMPDIR:-/tmp}/nile-kinetic-frames"; rm -rf "$FR"
node capture.js "$FR" seq 0 14.5
ffmpeg -v error -nostdin -y -framerate 30 -i "$FR/%05d.jpg" -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -movflags +faststart output/the-nile-kinetic-photo-edit-1080x1920.mp4
echo "done: output/the-nile-kinetic-photo-edit-1080x1920.mp4"
