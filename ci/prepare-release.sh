#!/bin/sh

# Setup git
git config --global user.email "ephordnb@gmail.com"
git config --global user.name "ephor"
standard-version -m "chore(release): publish %s [skip ci]"
#git remote set-url origin https://${PRIVATE_TOKEN}@github.com/${REPO_SLUG}.git
#git push --follow-tags origin master
