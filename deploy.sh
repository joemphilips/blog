#!/usr/bin/sh
hugo
aws s3 sync ./public/ s3://joemphilips.com
git add .
git commit -m "commit `date`"
git push
