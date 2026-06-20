$ErrorActionPreference = "Stop"

function Repair-MojibakeString([string]$value) {
    $current = $value

    for ($i = 0; $i -lt 3; $i++) {
        $hasSuspectChar =
            $current.IndexOf([char]0x00C3) -ge 0 -or
            $current.IndexOf([char]0x00C2) -ge 0 -or
            $current.IndexOf([char]0x00E2) -ge 0 -or
            $current.IndexOf([char]0x00F0) -ge 0 -or
            $current.IndexOf([char]0x0153) -ge 0 -or
            $current.IndexOf([char]0x20AC) -ge 0

        if (-not $hasSuspectChar) {
            break
        }

        $bytes = [System.Text.Encoding]::GetEncoding(28591).GetBytes($current)
        $decoded = [System.Text.Encoding]::UTF8.GetString($bytes)

        if ($decoded -eq $current) {
            break
        }

        $current = $decoded
    }

    return $current
}

function Repair-Node($node) {
    if ($null -eq $node) {
        return $null
    }

    if ($node -is [string]) {
        return (Repair-MojibakeString $node)
    }

    if ($node -is [System.Collections.IList]) {
        $items = @()
        foreach ($item in $node) {
            $items += ,(Repair-Node $item)
        }
        return $items
    }

    if ($node.PSObject -and $node.PSObject.Properties) {
        foreach ($property in $node.PSObject.Properties) {
            $property.Value = Repair-Node $property.Value
        }
        return $node
    }

    return $node
}

function Save-Json($path, $obj) {
    $json = $obj | ConvertTo-Json -Depth 100
    [System.IO.File]::WriteAllText((Resolve-Path $path), $json, [System.Text.UTF8Encoding]::new($false))
}

$files = Get-ChildItem "data" -Filter "*.json" | Where-Object { $_.Name -ne "cpold.json" }

foreach ($file in $files) {
    $json = Get-Content $file.FullName -Raw | ConvertFrom-Json
    $fixed = Repair-Node $json
    Save-Json $file.FullName $fixed
    Write-Host "Repaired $($file.Name)"
}
