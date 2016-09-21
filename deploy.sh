#!/usr/bin/env bash
hugo
aws s3 sync ./public/ s3://joemphilips.com || exit 1
git add .
git commit -m "commit `date` $1"
git pull && git push
