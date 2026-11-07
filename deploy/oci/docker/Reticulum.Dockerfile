FROM molecular-hubs/reticulum-build-check:arm64 AS release

FROM alpine:3.16.2

RUN apk add --no-cache \
    bash ca-certificates libstdc++ ncurses-libs openssl coreutils \
    && addgroup -g 1000 app \
    && adduser -D -u 1000 -G app app

WORKDIR /ret

COPY --from=release --chown=1000:1000 /_build/turkey/rel/ret/ /ret/

ENV ERL_AFLAGS="+C multi_time_warp"
ENV RELEASE_CONFIG_DIR="/run/ret-config"

USER 1000:1000

CMD ["/ret/bin/ret", "start"]
