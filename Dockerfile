FROM node:8
MAINTAINER Senomas <agus@senomas.com>

RUN apt-get update && apt-get install -y \
  rsync 
