[CmdletBinding()]
param(
    [string]$DataDir = "data",
    [string]$OutputFile = "js/data-bundle.js",
    [switch]$IncludeLegacy
)

$ErrorActionPreference = "Stop"

function Get-ProjectPath([string]$RelativePath) {
    return Join-Path -Path $PSScriptRoot -ChildPath ("..\" + $RelativePath)
}

function Get-RelativeDataPath([string]$BasePath, [string]$FullPath) {
    $resolvedBase = (Resolve-Path $BasePath).Path.TrimEnd('\') + '\'
    $resolvedFull = (Resolve-Path $FullPath).Path
    if (-not $resolvedFull.StartsWith($resolvedBase, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path is outside of data directory: $resolvedFull"
    }
    return $resolvedFull.Substring($resolvedBase.Length).Replace('\', '/')
}

$resolvedDataDir = Get-ProjectPath $DataDir
$resolvedOutputFile = Get-ProjectPath $OutputFile

if (-not (Test-Path $resolvedDataDir)) {
    throw "Data directory not found: $resolvedDataDir"
}

$files = Get-ChildItem -Path $resolvedDataDir -Filter *.json -Recurse | Sort-Object FullName
if (-not $IncludeLegacy) {
    $files = $files | Where-Object { $_.Name -ne "cpold.json" }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("window.DataBundle = window.DataBundle || {};")

foreach ($file in $files) {
    $relativeChild = Get-RelativeDataPath $resolvedDataDir $file.FullName
    $relativeKey = "data/$relativeChild"
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64 = [Convert]::ToBase64String($bytes)

    $lines.Add("window.DataBundle['$relativeKey'] = '$base64';")
    $lines.Add("window.DataBundle['./$relativeKey'] = window.DataBundle['$relativeKey'];")
}

$generatedAt = (Get-Date).ToUniversalTime().ToString("o")
$bundleFilesJson = ($files | ForEach-Object {
    $relativeChild = Get-RelativeDataPath $resolvedDataDir $_.FullName
    "data/$relativeChild"
} | ConvertTo-Json -Compress)
$lines.Add("window.DataBundle.__meta = { generatedAt: '$generatedAt', files: $bundleFilesJson };")

$outputDir = Split-Path -Path $resolvedOutputFile -Parent
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Set-Content -Path $resolvedOutputFile -Value $lines -Encoding utf8

Write-Host "Data bundle regenerated:" $resolvedOutputFile
Write-Host "Files included:" $files.Count
