FROM ubuntu:16.04

RUN \
  DEBIAN_FRONTEND=noninteractive apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y libgdal-dev

COPY entrypoint.sh /

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
