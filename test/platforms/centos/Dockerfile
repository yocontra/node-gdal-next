ARG VERSION=8
FROM centos:${VERSION}

ARG NODEJS=lts
ARG GDAL=""
ENV GDAL=${GDAL}

RUN \
  dnf update -y && \
  dnf -y install dnf-plugins-core && \
  dnf install -y epel-release && \
  dnf config-manager --set-enabled powertools && \
  dnf install -y curl && \
  curl -fsSL https://rpm.nodesource.com/setup_${NODEJS}.x | bash - && \
  dnf install -y nodejs && \
  dnf groupinstall -y 'Development Tools' && \
  dnf install -y gdal-devel git python36 && \
  alternatives --set python /usr/bin/python3

COPY entrypoint.sh /

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
