# Server Configuration & CI/CD Setup

This document outlines the server-side configuration for the True Random Songs backend and the CI/CD pipeline.

## 1. System Infrastructure
- **Server:** Ubuntu VPS (4GB RAM)
- **User:** `appuser`
- **Port:** `8002`
- **Public URL:** `https://songs-api.lordpatil.com`
- **Process Management:** `systemd`
- **Reverse Proxy:** Caddy
- **Python Management:** `uv`

## 2. Reverse Proxy (Caddy)
The backend is served through Caddy on port `8002`.

**Caddyfile snippet:**
```caddy
songs-api.lordpatil.com {
    # tls internal  # Optional: use this if you're not using standard Let's Encrypt
    reverse_proxy localhost:8002
}
```

## 3. Systemd Service
The application is managed by a `systemd` service to ensure it stays running and restarts on failure.

**Service File:** `/etc/systemd/system/true-random-songs.service`
```ini
[Unit]
Description=True Random Songs Backend Service
After=network.target

[Service]
User=appuser
Group=appuser
WorkingDirectory=/home/appuser/true-random-songs/backend
ExecStart=/home/appuser/.local/bin/uv run uvicorn main:app --host 0.0.0.0 --port 8002

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## 4. CI/CD Pipeline (GitHub Actions)
Deployments are automated via GitHub Actions using SSH.

- **Trigger:** Pushes to the `main` branch affecting the `backend/` directory.
- **Workflow:** `.github/workflows/deploy-backend.yml`
- **Secrets Required:**
  - `SSH_HOST`: Server IP or domain.
  - `SSH_PRIVATE_KEY`: Private SSH key for `appuser`.

### Deployment Steps:
1. SSH into the server.
2. `git pull origin main`.
3. Run `/home/appuser/.local/bin/uv sync` to update dependencies.
4. Restart the service: `sudo systemctl restart true-random-songs.service`.

## 5. Security (Sudoers)
To allow the GitHub Action to restart the service without a password, the following line was added to `sudo visudo`:
```text
appuser ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart true-random-songs.service
```

## 6. Manual Management Commands
- **Check Status:** `systemctl status true-random-songs.service`
- **View Logs:** `journalctl -u true-random-songs.service -f`
- **Manual Restart:** `sudo systemctl restart true-random-songs.service`
