#!/usr/bin/env bash
# Run ON the Droplet as root (Ubuntu 22.04 or 24.04):
#   bash setup.sh your-domain.example.com
# Before running: point an A record for that domain at the Droplet's IP.
# No domain? Use  <ip-with-dashes>.nip.io  e.g. 203-0-113-10.nip.io  (free, works with HTTPS).
set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then echo "Usage: bash setup.sh <domain>"; exit 1; fi
if [ "$(id -u)" -ne 0 ]; then echo "Run as root (sudo bash setup.sh <domain>)"; exit 1; fi

echo "==> Installing Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
docker compose version >/dev/null

echo "==> Opening firewall ports"
if command -v ufw >/dev/null 2>&1; then
  ufw allow OpenSSH
  ufw allow 80/tcp        # certificate issuing
  ufw allow 443/tcp       # wss signalling (via Caddy)
  ufw allow 7881/tcp      # WebRTC over TCP fallback
  ufw allow 50000:51000/udp  # WebRTC media
  ufw --force enable
fi

# Oracle Cloud Ubuntu images ship iptables rules that REJECT everything except SSH.
# Insert ACCEPT rules above that REJECT and save them so they survive a reboot.
if command -v iptables >/dev/null 2>&1 && iptables -S INPUT 2>/dev/null | grep -q -- "-j REJECT"; then
  echo "==> Opening ports in iptables (Oracle Cloud style)"
  for rule in "tcp --dport 80" "tcp --dport 443" "tcp --dport 7881" "udp --dport 50000:51000"; do
    iptables -C INPUT -p ${rule} -j ACCEPT 2>/dev/null || iptables -I INPUT 5 -p ${rule} -j ACCEPT
  done
  if command -v netfilter-persistent >/dev/null 2>&1; then
    netfilter-persistent save
  else
    DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent >/dev/null 2>&1 && netfilter-persistent save || \
      echo "WARNING: could not persist iptables rules; re-run setup.sh after a reboot."
  fi
fi

echo "==> Generating API key and secret"
API_KEY="API$(openssl rand -hex 6)"
API_SECRET="$(openssl rand -base64 36 | tr -d '/+=' | cut -c1-40)"

cat > livekit.yaml <<YAML
port: 7880
log_level: info
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 51000
  use_external_ip: true
keys:
  ${API_KEY}: ${API_SECRET}
YAML
chmod 600 livekit.yaml

echo "LIVEKIT_DOMAIN=${DOMAIN}" > .env

echo "==> Starting LiveKit and Caddy"
docker compose up -d

cat <<OUT

Done. Put these three values in Vercel (and your .env.local), then redeploy:

  LIVEKIT_URL=wss://${DOMAIN}
  LIVEKIT_API_KEY=${API_KEY}
  LIVEKIT_API_SECRET=${API_SECRET}

Keep the secret private. It is also saved in $(pwd)/livekit.yaml (readable by root only).
Check logs with:  docker compose logs -f livekit
OUT
