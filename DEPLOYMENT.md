# LankanAds.lk — Deployment Guide (GitHub + VPS)

Three independent apps, deployed together on one VPS from one parent folder,
each pushed to its own GitHub repo:

| App      | Folder      | Runs as              | Port | Suggested domain         |
|----------|-------------|-----------------------|------|---------------------------|
| Backend  | `backend/`  | `node index.js`       | 8000 | `api.lankanadslk.com`     |
| Frontend | `frontend/` | `next start -p 3000`  | 3000 | `lankanadslk.com`         |
| Admin    | `admin/`    | `next start -p 3001`  | 3001 | `admin.lankanadslk.com`   |

Current GitHub status (checked at time of writing):
- **backend** → already connected to `https://github.com/MMAkbar993/lankanbackend.git`, branch `main`, up to date.
- **frontend** → already connected to `https://github.com/MMAkbar993/lankanfrontend.git`, branch `main`, up to date.
- **admin** → **not currently a git repo** (no `.git` folder). Needs to be initialized and pushed to a new GitHub repo — see Part 1.

`.env` files are gitignored in all three projects, so they never travel through GitHub — they're created by hand directly on the VPS (Part 4).

---

## Part 1 — Get all three on GitHub

### Backend & frontend (already set up)
From each folder, whenever you have changes to ship:
```bash
cd backend    # or frontend
git add .
git commit -m "describe the change"
git push origin main
```

### Admin (needs first-time setup)
1. Create a new empty repo on GitHub (e.g. `lankanadmin`) — don't initialize it with a README.
2. From the `admin/` folder locally:
   ```bash
   cd admin
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/lankanadmin.git
   git push -u origin main
   ```

---

## Part 2 — One-time VPS setup

These commands assume Ubuntu/Debian; adjust package manager commands if your VPS uses something else.

```bash
# Node.js (use whatever LTS version matches your local dev — check with `node -v`)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 — keeps all three apps running persistently
sudo npm install -g pm2

# nginx — reverse proxy so all three share ports 80/443 under different domains
sudo apt-get install -y nginx

# certbot — free HTTPS certificates
sudo apt-get install -y certbot python3-certbot-nginx

# git (usually preinstalled, but just in case)
sudo apt-get install -y git
```

---

## Part 3 — Transfer the whole `aubrey` folder to the VPS in one go

Instead of cloning the three repos separately on the server, push the entire
local `aubrey` folder up as a single transfer with `rsync` (run this from
your local machine, not the VPS). This skips `node_modules`, `.next` build
output, and `.env` files — those get regenerated/recreated on the server
(Parts 4–5), and `node_modules` should never be copied between machines since
some packages compile native binaries specific to the OS/architecture.

```bash
# from e:\fiverr\aubrey locally (adjust user@host and remote path)
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env' \
  --exclude '.git' \
  ./ user@your-vps-ip:/var/www/lankanads/
```

No `rsync` on Windows? Use WinSCP, or `scp -r`, or zip the folder and upload/unzip
it — any method that gets the folder onto the server works, `rsync` is just the
one that skips excluded folders and re-syncs only changed files on future runs.

First-time server prep:
```bash
sudo mkdir -p /var/www/lankanads
sudo chown $USER:$USER /var/www/lankanads
```

The result should match the layout `ecosystem.config.js` (see Part 6) expects:
```
/var/www/lankanads/
├── ecosystem.config.js
├── backend/
├── frontend/
└── admin/
```
Since this transfers the folder directly, `ecosystem.config.js` and everything
else comes along automatically — no separate copy step needed.

> Your `backend` and `frontend` folders still have their own GitHub remotes
> (`lankanbackend`, `lankanfrontend`) — keep committing/pushing to those from
> your local machine as usual for version history/backup. GitHub just isn't
> what the VPS pulls *from* anymore; `rsync` is.

---

## Part 4 — Environment variables

Create these files directly on the VPS (they're not in git). Use `nano` or `vim`.

**`backend/.env`**
```
PORT=8000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
SMSAPI_TOKEN=
SMSAPI_FROM=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CONTACT_RECEIVER_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**`frontend/.env`**
```
NEXT_PUBLIC_API_BASE_URL=https://api.lankanadslk.com
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

**`admin/.env`**
```
NEXT_PUBLIC_API_BASE_URL=https://api.lankanadslk.com
```

> Since the Mongo and SMTP passwords were pasted into a chat earlier during
> development, it's worth rotating both before/after going live.

---

## Part 5 — Install, build, and start

```bash
cd /var/www/lankanads

cd backend && npm install && cd ..
cd frontend && npm install && npm run build && cd ..
cd admin && npm install && npm run build && cd ..

pm2 start ecosystem.config.js
pm2 save
pm2 startup     # follow the printed command to enable start-on-reboot
```

Useful PM2 commands going forward:
```bash
pm2 status              # see all 3 processes and their state
pm2 logs lankanads-backend
pm2 restart lankanads-frontend
pm2 restart all
```

---

## Part 6 — nginx reverse proxy + HTTPS

Create `/etc/nginx/sites-available/lankanads`:
```nginx
server {
    listen 80;
    server_name lankanadslk.com www.lankanadslk.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name admin.lankanadslk.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name api.lankanadslk.com;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lankanads /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# HTTPS for all three domains at once:
sudo certbot --nginx -d lankanadslk.com -d www.lankanadslk.com -d admin.lankanadslk.com -d api.lankanadslk.com
```

(Adjust `admin.lankanadslk.com` if you want a different domain/subdomain for the admin panel — update this nginx config, the DNS record, and `admin/.env` / `frontend/.env` accordingly.)

Make sure DNS A-records for all four hostnames point at the VPS's IP before running certbot.

---

## Part 7 — Shipping future changes

Re-run the same `rsync` command from Part 3 from your local `aubrey` folder —
it only transfers files that actually changed:
```bash
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env' \
  --exclude '.git' \
  ./ user@your-vps-ip:/var/www/lankanads/
```

Then on the VPS, for whichever app(s) changed:
```bash
cd /var/www/lankanads/backend    # or frontend / admin
npm install               # only needed if package.json changed
npm run build              # frontend/admin only — skip for backend
pm2 restart lankanads-backend    # or lankanads-frontend / lankanads-admin
```

(Separately, still `git commit`/`git push` from your local `backend`/`frontend`
folders to their GitHub repos whenever you want — that's just for version
history now, not part of the deploy path.)

---

## Troubleshooting

- **A request seems to hit stale/wrong data after restarting an app**: check for a leftover process still holding the port —
  ```bash
  pm2 status                       # is there a duplicate/errored process?
  sudo lsof -i :8000                # or :3000 / :3001 — see what's actually bound
  pm2 delete lankanads-backend && pm2 start ecosystem.config.js --only lankanads-backend
  ```
- **"Database unavailable" (503) from the backend**: check `pm2 logs lankanads-backend` for the real `MongoDB connection failed:` line underneath — usually an IP not allow-listed in MongoDB Atlas → Network Access, or a stale `.env` value that needs a `pm2 restart` to take effect.
- **OTP send fails with a 403 "region not enabled"**: that's the SMS provider (SMSAPI.LK) rejecting the destination country, not a bug — test with a real `+94` Sri Lankan number, or contact SMSAPI.LK to enable other regions on the account.
- **Env var changes not taking effect**: `.env` is only read at process start — always `pm2 restart <app>` after editing it.
