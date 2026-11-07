#!/usr/bin/env bash
# Rebuilds the transparent frame sequences from the Higgsfield clips (run from this folder).
set -e
mkdir -p layers/syrup layers/strawberry
ffmpeg -v error -y -i higgsfield/syrup-drips.mp4        -vf "fps=30,colorkey=0x6CDCCB:0.22:0.10,format=rgba" layers/syrup/f%04d.png
ffmpeg -v error -y -i higgsfield/strawberry-falling.mp4 -vf "fps=30,colorkey=0x6CD8CB:0.20:0.12,format=rgba" layers/strawberry/f%04d.png
mkdir -p layers/splash
ffmpeg -v error -y -i higgsfield/sauce-splash-side.mp4  -vf "fps=30,colorkey=0x63DFCB:0.20:0.10,format=rgba" layers/splash/f%04d.png
echo "done"
