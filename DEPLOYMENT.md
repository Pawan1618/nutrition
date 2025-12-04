# Deploy to GitHub Pages with GitHub Actions

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Add GitHub Secrets

Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add these 2 secrets:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### 3. Push to GitHub

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 4. Wait for Deployment

- Go to the **Actions** tab in your repository
- Watch the workflow run
- Once complete, your site will be live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

## Configuration Files

### `.github/workflows/deploy.yaml`
- Automatically triggers on push to `main` branch
- Builds the Next.js app
- Deploys to GitHub Pages

### `next.config.ts`
- Configured for static export (`output: 'export'`)
- Images optimized for static hosting

## Local Testing

Test the production build locally:

```bash
npm run build
npx serve@latest out
```

## Troubleshooting

**Issue:** 404 on page refresh
- GitHub Pages doesn't support client-side routing by default
- Use hash-based routing or add a custom 404.html

**Issue:** Environment variables not working
- Make sure secrets are added in GitHub repository settings
- Check the Actions tab for build logs

## Your Live Site

After deployment completes, visit:
```
https://YOUR_USERNAME.github.io/nutrition_tracker/
```

Replace `YOUR_USERNAME` with your GitHub username.
