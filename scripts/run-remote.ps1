# Script to run an existing Docker Hub image with local env vars
param([string]$ImageName)

if ([string]::IsNullOrWhiteSpace($ImageName)) {
    $ImageName = Read-Host "Please enter the full Docker Hub image name (e.g. username/project:latest)"
}

Write-Host "Stopping any existing container named 'nutrition-tracker-container'..."
docker rm -f nutrition-tracker-container 2>$null

$EnvArgs = @()
if (Test-Path .env.local) {
    Write-Host "Loading environment variables from .env.local..."
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim()
            # Handle quotes
            if ($val -match '^"(.*)"$') { $val = $matches[1] }
            elseif ($val -match "^'(.*)'$") { $val = $matches[1] }
            
            $EnvArgs += "-e"
            $EnvArgs += "$key=$val"
        }
    }
}

Write-Host "Starting container from image: $ImageName"
# Run with -d (detached) or foreground? User asked to "run", foreground implies they see logs.
# We'll map port 3000.
docker run --name nutrition-tracker-container -p 3000:3000 --init @EnvArgs $ImageName
