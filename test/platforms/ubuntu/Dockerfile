ARG VERSION=20.04
FROM ubuntu:${VERSION}

ARG NODEJS=lts
ARG GDAL=""
ENV GDAL=${GDAL}

RUN \
  DEBIAN_FRONTEND=noninteractive apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_${NODEJS}.x | bash - && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y libgdal-dev git

COPY entrypoint.sh /

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
