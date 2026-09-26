[CmdletBinding()]
param(
    [int]$RecentMinutes = 180
)

$ErrorActionPreference = "Stop"

function Get-ProjectPath([string]$RelativePath) {
    return Join-Path -Path $PSScriptRoot -ChildPath ("..\" + $RelativePath)
}

$projectRoot = Get-ProjectPath "."
$dataDir = Get-ProjectPath "data"
$bundleScript = Join-Path $PSScriptRoot "regenerate-data-bundle.ps1"
$bundleFile = Get-ProjectPath "js/data-bundle.js"

if (-not (Test-Path $bundleScript)) {
    throw "Missing script: $bundleScript"
}

Write-Host ""
Write-Host "[1/3] Regeneration du bundle local..." -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File $bundleScript

Write-Host ""
Write-Host "[2/3] JSON modifies recemment..." -ForegroundColor Cyan
$threshold = (Get-Date).AddMinutes(-1 * [Math]::Abs($RecentMinutes))
$recentFiles = Get-ChildItem -Path $dataDir -Filter *.json |
    Where-Object { $_.LastWriteTime -ge $threshold } |
    Sort-Object LastWriteTime -Descending

if ($recentFiles) {
    $recentFiles |
        Select-Object Name, LastWriteTime, Length |
        Format-Table -AutoSize
} else {
    Write-Host "Aucun fichier data/*.json modifie sur les $RecentMinutes dernieres minutes."
}

Write-Host ""
Write-Host "[3/3] Rappel refresh navigateur..." -ForegroundColor Cyan
Write-Host "- Recharge forte : Ctrl+F5"
Write-Host "- Si la PWA est installee : fermer completement puis relancer"
Write-Host "- Bundle local mis a jour : $bundleFile"
Write-Host ""
