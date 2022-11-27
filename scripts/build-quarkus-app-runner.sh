#!/bin/bash

set -e

cd ./AppRunner/quarkus
mvn clean package
cp -r target/quarkus-app/ src/main/docker/target/
cd -