#!/usr/bin/env bash

export NODE_TLS_REJECT_UNAUTHORIZED=0 
export ROUTER_BASE_PATH=/spoke 
export BASE_ASSETS_PATH=https://hubs.local:9090/ 
export HUBS_SERVER=hubs.local:4000 
export RETICULUM_SERVER=hubs.local:4000 

yarn start 