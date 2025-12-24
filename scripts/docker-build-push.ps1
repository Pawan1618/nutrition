# Docker Build and Push Script
# This script helps you build your Docker image and push it to Docker Hub.

param (
    [string]$ImageName = "nutrition-tracker",
    [string]$DockerHubUsername
)

$ErrorActionPreference = "Stop"

# 1. Load Environment Variables from .env.local
if (Test-Path .env.local) {
    Write-Host "Loading environment variables from .env.local..." -ForegroundColor Cyan
    Get-Content .env.local | ForEach-Object {
        # Match lines like KEY=VALUE or KEY="VALUE"
        if ($_ -match '^([^#=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Remove surrounding quotes if present
            if ($value -match '^"(.*)"$') { $value = $matches[1] }
            elseif ($value -match "^'(.*)'$") { $value = $matches[1] }

            # Set variable in script scope
            Set-Variable -Name $name -Value $value -Scope Script
        }
    }
} else {
    Write-Warning ".env.local not found! Build might fail if secrets are missing."
}

# 2. Check for Docker Hub Username
if ([string]::IsNullOrWhiteSpace($DockerHubUsername)) {
    $DockerHubUsername = Read-Host "Enter your Docker Hub Username"
}

if ([string]::IsNullOrWhiteSpace($DockerHubUsername)) {
    Write-Error "Docker Hub Username is required."
}

# 3. Define Tag
$Tag = Read-Host "Enter version tag (e.g., v1.0, latest) [default: latest]"
if ([string]::IsNullOrWhiteSpace($Tag)) { $Tag = "latest" }

$FullImageName = "$DockerHubUsername/$ImageName`:$Tag"

Write-Host "`n--------------------------------------------------" -ForegroundColor Green
Write-Host "Building Image: $FullImageName"
Write-Host "--------------------------------------------------`n" -ForegroundColor Green

# 4. Build the Image
# We pass the Supabase keys as build arguments so they are baked into the image
docker build -t $FullImageName . `
    --build-arg NEXT_PUBLIC_SUPABASE_URL=$script:NEXT_PUBLIC_SUPABASE_URL `
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$script:NEXT_PUBLIC_SUPABASE_ANON_KEY `
    --build-arg GITHUB_ID=$script:GITHUB_ID `
    --build-arg GITHUB_SECRET=$script:GITHUB_SECRET

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker Build Failed!"
}

Write-Host "`n--------------------------------------------------" -ForegroundColor Green
Write-Host "Pushing Image: $FullImageName"
Write-Host "--------------------------------------------------`n" -ForegroundColor Green

# 5. Push to Docker Hub
# Ensure you are logged in first!
docker push $FullImageName

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccess! Image pushed to Docker Hub." -ForegroundColor Green
    Write-Host "You can pull it anywhere with: docker pull $FullImageName" -ForegroundColor Cyan
} else {
    Write-Error "Docker Push Failed. Make sure you are logged in with 'docker login'."
}
