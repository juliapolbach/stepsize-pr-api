#!/usr/bin/env bash

docker build --no-cache -t stepsize ./docker-db
docker rm -f stepsize-pr-api 2>/dev/null
docker inspect stepsize-network > /dev/null 2>&1 || docker network create -d bridge stepsize-network
docker run --name mysql-stepsize -p 33060:3306 -e MYSQL_ROOT_PASSWORD=root -d --network=stepsize-network stepsize

#docker rm -f stepsize-pr-api 2>/dev/null
#docker inspect stepsize-network > /dev/null 2>&1 || docker network create -d bridge stepsize-network
#docker run -d --name mysql-stepsize -p 3306 -e MYSQL_ROOT_PASSWORD=pwd stepsize
