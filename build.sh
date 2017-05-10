#!/bin/bash

NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2; tput bold)

function red()
{
    echo "$RED$1$NORMAL"
}

function green {
    echo "$GREEN$1$NORMAL"
}

red "开始拉代码"
git pull

red "开始跑build........"
grunt build

if [ "$1" = "local" ]
then
    red "local build"
else
    red "build test"
    npm run copy
    pm2 restart server/https.js -n web-https
fi

green "done.................."
