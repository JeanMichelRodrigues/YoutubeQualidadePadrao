# Gera dist\qualidade-padrao-para-youtube-<versao>.zip só com os arquivos da extensão.
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$root = Split-Path $PSScriptRoot -Parent
$ver = (Get-Content "$root\manifest.json" -Raw | ConvertFrom-Json).version
New-Item -ItemType Directory -Force "$root\dist" | Out-Null
$zip = "$root\dist\qualidade-padrao-para-youtube-$ver.zip"
Remove-Item $zip -ErrorAction SilentlyContinue

$files = @("manifest.json", "content.js", "main.js", "defaults.js", "popup.html", "popup.js") +
         (Get-ChildItem "$root\icons" -File | ForEach-Object { "icons/" + $_.Name }) +
         (Get-ChildItem "$root\_locales" -Recurse -File | ForEach-Object { $_.FullName.Substring($root.Length + 1).Replace('\', '/') })

$fs = [IO.File]::Open($zip, 'Create')
$za = New-Object IO.Compression.ZipArchive($fs, [IO.Compression.ZipArchiveMode]::Create)
foreach ($f in $files) {
  # nomes com "/" (o Compress-Archive do PowerShell 5 grava "\" e a loja pode recusar)
  [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($za, "$root\$($f.Replace('/','\'))", $f) | Out-Null
}
$za.Dispose(); $fs.Dispose()
Write-Host "Gerado: $zip"
$z = [IO.Compression.ZipFile]::OpenRead($zip); $z.Entries | ForEach-Object { $_.FullName }; $z.Dispose()
