#!/bin/bash

if [ "$1" = "" ]
then
    PORT='3000' grunt server 
    NODE_ENV='local' PORT='3000' node server/http.js & grunt watch
else
    PORT='3000' grunt server:"$1" 
    NODE_ENV='local' PORT='3000' node server/http.js & grunt dowatch:"$1"
fi

