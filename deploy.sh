#!/usr/bin/env bash
# =============================================================================
# Malaria Drug Resistance Platform — one-shot VPS deploy (IP:PORT, no domain)
# Run this ON THE VPS, from inside the project folder:
#   cd /root/Malaria_Drug_Resistance_Prediction_Platform
#   bash deploy.sh
# Safe to re-run — it redeploys and won't touch your other apps.
# =============================================================================
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
FRONTEND_PORT="${FRONTEND_PORT:-8090}"

echo "==> Malaria platform deploy starting"

# --- 0. sanity checks -------------------------------------------------------
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "ERROR: $COMPOSE_FILE not found. Run this from inside the project folder." >&2
  exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not installed." >&2
  exit 1
fi

# --- 1. detect the VPS public IP -------------------------------------------
VPS_IP="$(curl -fsS --max-time 5 ifconfig.me 2>/dev/null || true)"
if [ -z "$VPS_IP" ]; then
  read -rp "Could not auto-detect public IP. Enter this VPS's public IP: " VPS_IP
fi
echo "==> Using VPS IP: $VPS_IP   frontend port: $FRONTEND_PORT"

# --- 2. check the chosen port is free --------------------------------------
if ss -tlnp 2>/dev/null | grep -q ":${FRONTEND_PORT} "; then
  echo "ERROR: port ${FRONTEND_PORT} is already in use. Re-run with a free one:" >&2
  echo "       FRONTEND_PORT=8091 bash deploy.sh" >&2
  exit 1
fi
echo "==> Port ${FRONTEND_PORT} is free."

# --- 3. create .env (only if it doesn't already exist) ---------------------
if [ -f .env ]; then
  echo "==> .env already exists — leaving it untouched."
else
  echo "==> Generating .env with fresh secrets..."
  SECRET_KEY="$(openssl rand -hex 32)"
  POSTGRES_PASSWORD="$(openssl rand -hex 16)"
  cat > .env <<EOF
SECRET_KEY=${SECRET_KEY}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
FRONTEND_PORT=${FRONTEND_PORT}
CORS_ORIGINS=http://${VPS_IP}:${FRONTEND_PORT}
EOF
  echo "==> .env created. Secrets are stored there — keep it private."
fi

# --- 4. open the firewall (ufw only if present) ----------------------------
if command -v ufw >/dev/null 2>&1; then
  echo "==> Configuring ufw (keeping SSH open)..."
  ufw allow 22/tcp    >/dev/null 2>&1 || true
  ufw allow "${FRONTEND_PORT}/tcp" >/dev/null 2>&1 || true
  yes | ufw enable    >/dev/null 2>&1 || true
  echo "==> ufw allows 22 and ${FRONTEND_PORT}."
else
  echo "==> ufw not installed — skipping local firewall step."
fi
echo "    NOTE: also open TCP ${FRONTEND_PORT} in your cloud provider's firewall/security group."

# --- 5. build & start -------------------------------------------------------
echo "==> Building and starting containers (first run takes a few minutes)..."
docker compose -f "$COMPOSE_FILE" up -d --build

echo "==> Container status:"
docker compose -f "$COMPOSE_FILE" ps

# --- 6. done ----------------------------------------------------------------
cat <<EOF

=============================================================
  Deploy complete.

  Open:  http://${VPS_IP}:${FRONTEND_PORT}

  Logs:      docker compose -f ${COMPOSE_FILE} logs -f
  Restart:   docker compose -f ${COMPOSE_FILE} restart
  Stop:      docker compose -f ${COMPOSE_FILE} down
  Redeploy:  bash deploy.sh
=============================================================
EOF
