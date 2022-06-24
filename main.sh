#!/bin/bash

set -e

# files=$(find ./libs -type f \( -name "*.*" ! -name ".*" \))

# for file in $files
# do
#   echo "un gzip: $file"
#   gunzip -S "" -f -d $file
# done

IMAGE_REPO="qxcr.xyz/lowcode"
DATE=$(date "+%Y%m%d")

docker build -t "$IMAGE_REPO/qxp-web-vendors:latest" -f ./deploy/Dockerfile-vendors .
docker push "$IMAGE_REPO/qxp-web-nginx:latest"
