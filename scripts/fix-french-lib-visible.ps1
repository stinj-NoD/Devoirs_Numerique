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

function Repair-Node($node, [string]$parentKey = "") {
    if ($null -eq $node) {
        return $null
    }

    if ($node -is [string]) {
        if ($parentKey -in @("icon", "img")) {
            return $node
        }
        return (Repair-MojibakeString $node)
    }

    if ($node -is [System.Collections.IList]) {
        $items = @()
        foreach ($item in $node) {
            $items += ,(Repair-Node $item $parentKey)
        }
        return $items
    }

    if ($node.PSObject -and $node.PSObject.Properties) {
        $repaired = [ordered]@{}
        foreach ($property in $node.PSObject.Properties) {
            $name = if ($property.Name -in @("icon", "img")) {
                $property.Name
            } else {
                Repair-MojibakeString $property.Name
            }

            $repaired[$name] = Repair-Node $property.Value $property.Name
        }
        return [pscustomobject]$repaired
    }

    return $node
}

function Save-Json($path, $obj) {
    $json = $obj | ConvertTo-Json -Depth 100
    [System.IO.File]::WriteAllText((Resolve-Path $path), $json, [System.Text.UTF8Encoding]::new($false))
}

$path = "data/french_lib.json"
$json = Get-Content $path -Raw | ConvertFrom-Json
$fixed = Repair-Node $json
Save-Json $path $fixed
Write-Host "Fixed visible strings in $path"
