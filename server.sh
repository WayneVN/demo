#!/bin/bash
grunt copy
if [ "$1" = "" ]
then
    grunt hotServer & grunt connect
else
    grunt hotServer:"$1" & grunt connect
fi