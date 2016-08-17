#!/usr/bin/env bash

cd ~/jdc && git pull origin master
sudo cp -R ~/jdc/public/2015/ /usr/share/nginx/html/justindorfman.com/
/usr/bin/nodejs ~/purge.js
