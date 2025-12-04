# PowerShell script to add dark: variants back to TSX files

$files = Get-ChildItem -Path "c:\Users\pawan\nutrition_tracker\app" -Recurse -Filter "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName | Out-String
    
    # Add dark variants for common patterns
    $content = $content -replace 'bg-slate-50(?!\s)', 'bg-slate-50 dark:bg-slate-950'
    $content = $content -replace 'bg-slate-100(?!\s)', 'bg-slate-100 dark:bg-slate-900'
    $content = $content -replace 'text-slate-900(?!\s)', 'text-slate-900 dark:text-slate-100'
    $content = $content -replace 'text-slate-500(?!\s)', 'text-slate-500 dark:text-slate-400'
    $content = $content -replace 'text-slate-400(?!\s)', 'text-slate-400 dark:text-slate-500'
    $content = $content -replace 'border-slate-200(?!\s)', 'border-slate-200 dark:border-slate-800'
    $content = $content -replace 'border-slate-300(?!\s)', 'border-slate-300 dark:border-slate-700'
    $content = $content -replace 'bg-white/60(?!\s)', 'bg-white/60 dark:bg-slate-900/40'
    $content = $content -replace 'bg-white/90(?!\s)', 'bg-white/90 dark:bg-slate-950/80'
    $content = $content -replace 'border-white/5(?!\s)', 'border-white/5 dark:border-white/5'
    $content = $content -replace 'text-white(?!\s)', 'text-white dark:text-white'
    
    $content | Set-Content $file.FullName
}

Write-Host "Dark variants added to all TSX files"
