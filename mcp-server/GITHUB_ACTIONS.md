# GitHub Actions & Secrets

## Repository Secrets

The following secrets have been configured for this repository:

| Secret Name | Description | Status |
|------------|-------------|--------|
| `TURSO_DATABASE_URL` | Turso database connection URL | ✅ Set |
| `TURSO_AUTH_TOKEN` | Turso authentication token | ✅ Set |
| `GEMINI_API_KEY` | Google Gemini API key for enrichment | ✅ Set |

### Using Secrets in GitHub Actions

Reference these secrets in your workflow files:

```yaml
name: Deploy MCP Server
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd mcp-server
          npm install
      
      - name: Build
        run: |
          cd mcp-server
          npm run build
      
      - name: Deploy
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          # Your deployment commands here
          echo "Deploying with configured secrets..."
```

### Verifying Secrets

To verify secrets are set (without exposing values):

```bash
gh secret list
```

Output should show:
```
GEMINI_API_KEY      2026-02-02T22:19:35Z
TURSO_AUTH_TOKEN    2026-02-02T22:19:34Z
TURSO_DATABASE_URL  2026-02-02T22:19:33Z
```

### Adding New Secrets

If you need to add or update secrets:

```bash
# Add a new secret
echo "secret_value" | gh secret set SECRET_NAME

# Update an existing secret (same command)
echo "new_value" | gh secret set EXISTING_SECRET

# Delete a secret
gh secret delete SECRET_NAME
```

### Security Best Practices

✅ **Do:**
- Use repository secrets for sensitive values
- Rotate tokens regularly
- Use environment-specific secrets for prod/staging
- Limit secret access to necessary workflows only

❌ **Don't:**
- Commit secrets to `.env` files
- Print secret values in logs
- Share secrets in pull request comments
- Use secrets in forks (they're not accessible)

### Deployment Platforms

When deploying to platforms, configure these environment variables:

#### Railway
```bash
railway variables set TURSO_DATABASE_URL=${{ secrets.TURSO_DATABASE_URL }}
railway variables set TURSO_AUTH_TOKEN=${{ secrets.TURSO_AUTH_TOKEN }}
railway variables set GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}
```

#### Fly.io
```bash
fly secrets set TURSO_DATABASE_URL=${{ secrets.TURSO_DATABASE_URL }}
fly secrets set TURSO_AUTH_TOKEN=${{ secrets.TURSO_AUTH_TOKEN }}
fly secrets set GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}
```

#### Vercel
```bash
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add GEMINI_API_KEY
```

#### Netlify
Add via dashboard or CLI:
```bash
netlify env:set TURSO_DATABASE_URL "value"
netlify env:set TURSO_AUTH_TOKEN "value"
netlify env:set GEMINI_API_KEY "value"
```

### Local Development

For local development, use `.env` file (already gitignored):

```bash
cp mcp-server/.env.example mcp-server/.env
# Edit .env with your local values
```

**Never commit `.env` to the repository!**

---

**Last Updated:** 2026-02-02  
**Secrets Count:** 3/3 configured
