FROM ubuntu

RUN apt-get update && \
    apt-get install --no-install-recommends -y ca-certificates curl jq

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
