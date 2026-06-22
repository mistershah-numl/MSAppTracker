# MS Application Tracker — Deployment Guide
Muhammad Shah | Fall 2027 Applications

## Architecture
```
Browser (index.html) → Vercel API Routes (Node.js) → Supabase (PostgreSQL)
```
All data lives in Supabase. Works from any browser, any device, any location.

---

## Step 1 — Supabase Setup (5 minutes)

1. Go to https://supabase.com → Sign up (free)
2. Click **New Project** → name it `ms-tracker` → set a DB password → pick a region close to you (e.g. US East or EU)
3. Wait ~2 min for the project to boot
4. Go to **SQL Editor** (left sidebar) → **New Query**
5. Copy the entire contents of `supabase_schema.sql` and paste it → click **Run**
6. You should see "Success. No rows returned"

**Get your keys:**
- Go to **Project Settings → API**
- Copy **Project URL** → this is your `SUPABASE_URL`
- Copy **service_role** key (under "Project API keys", click to reveal) → this is your `SUPABASE_SERVICE_KEY`
  ⚠️ Keep the service key secret — it bypasses RLS. Never expose it in frontend code.

---

## Step 2 — Deploy to Vercel (5 minutes)

### Option A: GitHub (recommended)
1. Push this folder to a GitHub repo:
   ```bash
   cd ms-tracker
   git init
   git add .
   git commit -m "initial"
   gh repo create ms-tracker --private --push --source=.
   ```
2. Go to https://vercel.com → **Add New Project** → Import your repo
3. Vercel auto-detects the `vercel.json` — no framework preset needed
4. Before clicking Deploy, click **Environment Variables** and add:
   ```
   SUPABASE_URL         = https://xxxx.supabase.co   (your Project URL)
   SUPABASE_SERVICE_KEY = eyJhbGc...                 (your service_role key)
   API_SECRET           = YourSecretPassword123!     (make this up — this is your login password)
   ```
5. Click **Deploy** → done in ~1 minute

### Option B: Vercel CLI
```bash
npm install -g vercel
cd ms-tracker
npm install
vercel
# Follow prompts, then:
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add API_SECRET
vercel --prod
```

---

## Step 3 — Use It

1. Open your Vercel URL (e.g. `https://ms-tracker-xyz.vercel.app`)
2. Enter the password you set as `API_SECRET`
3. Your password is saved in your browser — no re-login needed on same device
4. From any other device, open the same URL and enter the password once

---

## How It Works

| Action | What happens |
|--------|-------------|
| Add entry | POST /api/entries → saved to Supabase |
| Edit entry | PUT /api/entry?id=xxx → updated in Supabase |
| Delete entry | DELETE /api/entry?id=xxx → removed from Supabase |
| Load entries | GET /api/entries → fetched from Supabase |
| Password | Checked in every API request via `x-api-secret` header |
| Offline | Shows cached data from localStorage if server unreachable |

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key (server-side only) |
| `API_SECRET` | Your personal login password for the tracker |

---

## Custom Domain (optional)
In Vercel → your project → Settings → Domains → add your Hostinger domain
e.g. `tracker.yourdomain.com`

In Hostinger DNS: add a CNAME record pointing to `cname.vercel-dns.com`

---

## Updating the App
```bash
git add .
git commit -m "update"
git push
```
Vercel auto-deploys on every push.

---

## Folder Structure
```
ms-tracker/
├── vercel.json           # Routing config
├── package.json          # Dependencies
├── supabase_schema.sql   # Run once in Supabase SQL Editor
├── api/
│   ├── _supabase.js      # Shared DB client
│   ├── _auth.js          # Password auth middleware
│   ├── entries.js        # GET all / POST new
│   └── entry.js          # PUT update / DELETE by id
└── public/
    └── index.html        # Full tracker UI
```
