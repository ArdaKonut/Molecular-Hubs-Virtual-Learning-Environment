# syntax=docker/dockerfile:1
FROM hexpm/elixir:1.14.3-erlang-23.3.4.18-alpine-3.16.2 AS builder
RUN mix local.hex 2.2.1 --force && mix local.rebar --force
RUN apk add --no-cache nodejs yarn git build-base
COPY . .
RUN mix deps.get
RUN MIX_ENV=turkey mix release
