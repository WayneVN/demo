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

date

if [ "$1" = "" ]
then
    red "请输入tag号！"
else
    red "pull tag" + "$1"
    git checkout master

    git pull

    git checkout "$1"

    red  "run build"

    NODE_ENV='production' grunt build_release

    #grunt build_cdn

    red "run copy"
    npm run copy
    green "copy done ................"

    cp /home/data/tmp /home/works/apps/joudou/newDev/dist/images/erweima.jpg
    green "cp done................"
    pm2 restart server/https.js -n web-https
    date
fi




