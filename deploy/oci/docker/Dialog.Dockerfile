FROM molecular-hubs/dialog-build-check:arm64

WORKDIR /app

ENV NODE_ENV=production
ENV INTERACTIVE=false

USER node

CMD ["node", "index.js"]
