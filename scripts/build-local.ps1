# Script to build Docker image locally with environment variables from .env.local
# Usage: ./scripts/build-local.ps1 or npm run docker:build

$ErrorActionPreference = "Stop"

# Determine project root relative to this script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir
Set-Location $ProjectDir

$EnvPath = ".env.local"
$BuildArgs = @()

if (Test-Path $EnvPath) {
    Write-Host "Loading environment variables from $EnvPath..." -ForegroundColor Cyan
    $EnvContent = Get-Content $EnvPath
    
    foreach ($line in $EnvContent) {
        # Only pick up specific public keys to emulate standard nextjs behavior + safety
        if ($line -match "^(NEXT_PUBLIC_SUPABASE_.*|GITHUB_.*)=(.*)$") {
            $key = $matches[1]
            $val = $matches[2].Trim()
            
            # Remove quotes
            if ($val -match '^"(.*)"$') { $val = $matches[1] }
            elseif ($val -match "^'(.*)'$") { $val = $matches[1] }
            
            $BuildArgs += "--build-arg"
            $BuildArgs += "$key=$val"
        }
    }
} else {
    Write-Warning "$EnvPath not found. Build will likely fail."
}

Write-Host "Building Docker image 'nutrition-tracker:latest'..." -ForegroundColor Green

# invoke docker build
docker build -t nutrition-tracker:latest . @BuildArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build Successful! Run with: docker run -p 3000:3000 nutrition-tracker:latest" -ForegroundColor Green
}
