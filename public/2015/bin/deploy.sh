#!/usr/bin/env bash

cd /var/www/justindorfman.com/html/jdc/public/2015/ && git pull origin master
/usr/bin/env node ~/purge.js

### K.I.S.S. ###