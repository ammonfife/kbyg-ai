# GitHub Actions Workflows

## Active Workflows

### 📦 Sync Chrome Extension to Public Repo

**File:** `sync-extension.yml`

**Purpose:** Automatically syncs `chrome-extension/` folder to public `ammonfife/kbyg-ai` repository.

**Triggers:**
- Push to `main` branch (when `chrome-extension/**` changes)
- Manual workflow dispatch

**Setup Required:**
- Personal Access Token (PAT) must be added as `KBYG_PAT` secret
- See: [`../.github/SYNC_SETUP.md`](../SYNC_SETUP.md)

**Status:** ⏳ Awaiting PAT configuration

---

## Quick Setup

1. **Create PAT:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens
   Scopes: repo (full)
   ```

2. **Add Secret:**
   ```
   Repository → Settings → Secrets → New secret
   Name: KBYG_PAT
   Value: <your-pat-token>
   ```

3. **Test:**
   ```bash
   # Make a change to extension
   echo "// Test" >> chrome-extension/test.txt
   git add . && git commit -m "Test sync" && git push
   
   # Check: https://github.com/altonalexander/easy-event-planner/actions
   ```

---

## Monitoring

**View runs:**
- Web: https://github.com/altonalexander/easy-event-planner/actions
- CLI: `gh run list --workflow=sync-extension.yml`

**Manual trigger:**
- Actions tab → Select workflow → "Run workflow"

---

**Full documentation:** See [`SYNC_SETUP.md`](../SYNC_SETUP.md)
