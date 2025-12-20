# Docker Start Script
# This script loads environment variables from .env.local and starts the app with Docker Compose.

$ErrorActionPreference = "Stop"

Write-Host "Preparing to start Docker environment..." -ForegroundColor Cyan

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

            # Set the variable in the current process (Session)
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Warning ".env.local not found! Build might fail if secrets are missing."
}

# 2. Check if variables are set
$SupabaseUrl = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL", "Process")
if ([string]::IsNullOrEmpty($SupabaseUrl)) {
    Write-Warning "WARNING: NEXT_PUBLIC_SUPABASE_URL is not set. The build will likely fail."
} else {
    Write-Host "Environment variables loaded successfully." -ForegroundColor Green
}

# 3. Run Docker Compose
Write-Host "Starting Docker Compose..." -ForegroundColor Green
# We use Invoke-Expression or direct execution. Direct is better.
docker-compose up --build
