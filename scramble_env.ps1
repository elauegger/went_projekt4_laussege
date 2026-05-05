[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string[]]$Suffixes,
    [string[]]$EnvFiles,
    [ValidateRange(8, 256)]
    [int]$Length = 40
)

# Standard-Listen im Skript (hier einfach erweiterbar)
$DefaultSuffixes = @(
    '_SECRET',
    '_PASSWORD'
)

$DefaultEnvFiles = @(
    '.env',
    '.env.dev',
    '.env.prod'
)

# Nutzungsbeispiele:
# 1) Simulation mit Standardlisten (keine Dateiänderung):
#    powershell -NoProfile -ExecutionPolicy Bypass -File .\scramble_env.ps1 -WhatIf
#
# 2) Echte Änderung mit Standardlisten:
#    powershell -NoProfile -ExecutionPolicy Bypass -File .\scramble_env.ps1
#
# 3) Erweiterte Suffixe und Dateien per Parameter:
#    powershell -NoProfile -ExecutionPolicy Bypass -File .\scramble_env.ps1 `
#      -Suffixes @('_SECRET','_PASSWORD','_TOKEN','_KEY') `
#      -EnvFiles @('.env','.env.dev','.env.prod','.env.staging') `
#      -Length 48

if (-not $PSBoundParameters.ContainsKey('Suffixes')) {
    $Suffixes = $DefaultSuffixes
}

if (-not $PSBoundParameters.ContainsKey('EnvFiles')) {
    $EnvFiles = $DefaultEnvFiles
}

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function New-RandomSecret {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateRange(8, 256)]
        [int]$SecretLength
    )

    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    $bytes = New-Object byte[] ($SecretLength)
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $rng.GetBytes($bytes)
    }
    finally {
        $rng.Dispose()
    }

    $builder = New-Object System.Text.StringBuilder
    foreach ($b in $bytes) {
        [void]$builder.Append($chars[$b % $chars.Length])
    }

    return $builder.ToString()
}

function Split-ValueAndComment {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ValuePart
    )

    $trimmed = $ValuePart.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return [pscustomobject]@{ TrailingComment = '' }
    }

    if ($trimmed -match '^(?<quoted>"(?:\\.|[^"])*"|''(?:\\.|[^''])*'')(?<comment>\s*#.*)?$') {
        $comment = if ($matches.ContainsKey('comment') -and $null -ne $matches.comment) { $matches.comment } else { '' }
        return [pscustomobject]@{ TrailingComment = $comment }
    }

    if ($trimmed -match '^(?<plain>[^#]*?)(?<comment>\s*#.*)?$') {
        $comment = if ($matches.ContainsKey('comment') -and $null -ne $matches.comment) { $matches.comment } else { '' }
        return [pscustomobject]@{ TrailingComment = $comment }
    }

    return [pscustomobject]@{ TrailingComment = '' }
}

function Get-ReplacementValue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CurrentValue,

        [Parameter(Mandatory = $true)]
        [ValidateRange(8, 256)]
        [int]$SecretLength
    )

    $trimmed = $CurrentValue.Trim()
    $parts = Split-ValueAndComment -ValuePart $CurrentValue

    $isDoubleQuoted = $trimmed -match '^"(?:\\.|[^"])*"(?:\s*#.*)?$'
    $isSingleQuoted = $trimmed -match '^''(?:\\.|[^''])*''(?:\s*#.*)?$'

    $newSecret = New-RandomSecret -SecretLength $SecretLength
    if ($isDoubleQuoted) {
        return '"' + $newSecret + '"' + $parts.TrailingComment
    }

    if ($isSingleQuoted) {
        return "'" + $newSecret + "'" + $parts.TrailingComment
    }

    return $newSecret + $parts.TrailingComment
}

$updatedTotal = 0
foreach ($envFile in $EnvFiles) {
    if (-not (Test-Path -LiteralPath $envFile)) {
        Write-Warning "Datei nicht gefunden: $envFile"
        continue
    }

    $lines = Get-Content -LiteralPath $envFile
    $updatedInFile = 0

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ($line -match '^\s*(#|$)') {
            continue
        }

        if ($line -match '^(?<prefix>\s*(?:export\s+)?)(?<key>[A-Za-z_][A-Za-z0-9_]*)(?<sep>\s*=\s*)(?<value>.*)$') {
            $key = $matches.key
            $shouldReplace = $false

            foreach ($suffix in $Suffixes) {
                if ($key.EndsWith($suffix, [System.StringComparison]::OrdinalIgnoreCase)) {
                    $shouldReplace = $true
                    break
                }
            }

            if ($shouldReplace) {
                $replacement = Get-ReplacementValue -CurrentValue $matches.value -SecretLength $Length
                $newLine = "$($matches.prefix)$key$($matches.sep)$replacement"

                if ($newLine -ne $line) {
                    $lines[$i] = $newLine
                    $updatedInFile++
                    $updatedTotal++
                }
            }
        }
    }

    if ($updatedInFile -gt 0) {
        if ($PSCmdlet.ShouldProcess($envFile, "$updatedInFile Variablen aktualisieren")) {
            Set-Content -LiteralPath $envFile -Value $lines -Encoding UTF8
            Write-Host "Aktualisiert: $envFile ($updatedInFile Treffer)"
        }
    }
    else {
        Write-Host "Keine passenden Variablen in $envFile gefunden."
    }
}

Write-Host "Fertig. Insgesamt geaendert: $updatedTotal"
