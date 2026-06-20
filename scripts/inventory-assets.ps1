[CmdletBinding()]
param(
    [string]$AssetsDir = "assets",
    [string]$OutputFile = "reports/asset-inventory.json"
)

$ErrorActionPreference = "Stop"

function Get-ProjectPath([string]$RelativePath) {
    return Join-Path -Path $PSScriptRoot -ChildPath ("..\" + $RelativePath)
}

$resolvedAssetsDir = Get-ProjectPath $AssetsDir
$resolvedOutputFile = Get-ProjectPath $OutputFile
$outputDir = Split-Path -Path $resolvedOutputFile -Parent
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$sourceFiles = @(
    Get-ChildItem (Get-ProjectPath "data") -Filter *.json -File
    Get-ChildItem (Get-ProjectPath "js") -Filter *.js -File
)

$referenceMap = @{}
foreach ($file in $sourceFiles) {
    $matches = Select-String -Path $file.FullName -Pattern 'assets/img/[A-Za-z0-9_\-]+\.png' -AllMatches
    foreach ($match in $matches) {
        foreach ($capture in $match.Matches) {
            $ref = $capture.Value.Replace('\', '/')
            if (-not $referenceMap.ContainsKey($ref)) {
                $referenceMap[$ref] = New-Object System.Collections.ArrayList
            }
            [void]$referenceMap[$ref].Add([pscustomobject]@{
                path = $file.FullName
                line = $match.LineNumber
            })
        }
    }
}

$existingFiles = @()
if (Test-Path $resolvedAssetsDir) {
    $existingFiles = Get-ChildItem $resolvedAssetsDir -Recurse -File | ForEach-Object {
        $_.FullName.Substring((Get-ProjectPath "").Length + 1).Replace('\', '/')
    }
}
$existingSet = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach ($file in $existingFiles) {
    [void]$existingSet.Add($file)
}

$references = $referenceMap.Keys | Sort-Object | ForEach-Object {
    [pscustomobject]@{
        ref = $_
        exists = $existingSet.Contains($_)
        usages = $referenceMap[$_]
    }
}

$missing = @($references | Where-Object { -not $_.exists })

$report = [pscustomobject]@{
    generatedAt = (Get-Date).ToUniversalTime().ToString("o")
    assetsDir = $AssetsDir
    assetsDirExists = (Test-Path $resolvedAssetsDir)
    existingAssetCount = $existingFiles.Count
    referencedAssetCount = $references.Count
    missingAssetCount = $missing.Count
    referencedAssets = $references
}

$json = $report | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($resolvedOutputFile, $json, [System.Text.UTF8Encoding]::new($true))

Write-Host "ASSET_INVENTORY_OK"
Write-Host "Assets dir exists:" (Test-Path $resolvedAssetsDir)
Write-Host "Existing assets:" $existingFiles.Count
Write-Host "Referenced assets:" $references.Count
Write-Host "Missing assets:" $missing.Count
Write-Host "Report:" $resolvedOutputFile
