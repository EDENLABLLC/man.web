#!/bin/sh

# Setup git
git config --global user.email "ephordnb@gmail.com"
git config --global user.name "ephor"
standard-version -m "chore(release): publish %s [ci skip]"
git remote set-url origin https://$GITHUB_TOKEN@github.com/edenlabllc/mithril.web.git
git push --follow-tags origin master
