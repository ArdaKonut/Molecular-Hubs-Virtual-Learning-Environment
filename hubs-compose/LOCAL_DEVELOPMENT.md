# Local development startup

This repository includes customized service source. Do not clone fresh upstream
repositories into `services`, and do not run `bin/services-update` to replace them.

Prerequisites: Docker with Compose v2, Node.js (for public JWK export), OpenSSL
with `req -addext` support, Bash, Mutagen and compatible Mutagen Compose.
On Windows use Git Bash for these commands.

From `hubs-compose`:

```bash
./bin/setup-local-keys
export PRIVATE_NETWORK_IP=192.168.1.100 # replace with your computer's LAN IPv4
./bin/init
./bin/up
```

`bin/up` detects the local IPv4 on Linux/macOS unless explicitly supplied.
Windows users must set it. The address must be reachable by participating clients;
Docker or WSL internal addresses may not be suitable for other LAN devices.

The setup script retains existing keys on repeated runs. It generates one RSA
permission signing key, a matching public PEM for Dialog, and public JWK for
PostgREST. Generated files are ignored by Git. TLS uses a separate self-signed
certificate covering local service names. Trust `priv/fullchain.pem` in your
local browser/OS trust store; never disable browser certificate verification.
Keep all private keys local, and use separately provisioned keys and trusted
certificates for production. Rebuilding images is necessary if keys change.

Add these names to your computer's hosts file for local browser access:

```text
127.0.0.1 hubs.local hubs-proxy.local hubs-assets.local hubs-link.local
```

For LAN clients use the server's LAN address instead of 127.0.0.1 and configure
certificate trust on each client. Open the landing page at `https://hubs.local:4000`.
Check room creation, scene loading and media connections in two browser sessions.
A successful image build alone does not establish that these features work.

The legacy READ_ME.txt describes historical setup. Its advice to disable browser
certificate checks is superseded by the trust instructions above. This stack is
a local development setup, not a production deployment configuration.
