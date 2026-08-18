# Split the UET handbook PDF into a text-free background layer per page.
#
# Pipeline for each page:
#   1. pdftocairo -svg : export the PDF page as vector SVG.
#   2. strip glyphs    : drop <use xlink:href="#glyph-*"> plus glyph definitions, leaving only artwork.
#   3. Chrome headless : rasterize the background SVG at the target pixel size.
#   4. System.Drawing  : re-encode the PNG as JPEG for web delivery.
#
# Output: frontend/public/assets/handbook/backgrounds/page-NN.jpg
[CmdletBinding()]
param(
  [string]$PdfPath = "$PSScriptRoot\..\frontend\public\assets\handbook\handbook-uet-2025.pdf",
  [string]$OutputDirectory = "$PSScriptRoot\..\frontend\public\assets\handbook\backgrounds",
  [int]$FirstPage = 1,
  [int]$LastPage = 0,
  [int]$RenderWidth = 993,
  [int]$RenderHeight = 1404,
  [int]$JpegQuality = 82
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function Resolve-Browser {
  $candidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
  )
  foreach ($candidate in $candidates) { if (Test-Path $candidate) { return $candidate } }
  throw 'No Chrome or Edge installation found for SVG rasterization.'
}

function Remove-SvgGlyphLayer {
  param([string]$Svg)
  $withoutGlyphUses = [regex]::Replace($Svg, '<use\s+xlink:href="#glyph-[^"]*"[^>]*/>\s*', '')
  return [regex]::Replace($withoutGlyphUses, '<g id="glyph-\d+-\d+">.*?</g>\s*', '', 'Singleline')
}

$pdf = (Resolve-Path $PdfPath).Path
if ($LastPage -le 0) {
  $info = & pdfinfo $pdf
  $LastPage = [int](($info | Select-String -Pattern '^Pages:\s+(\d+)$').Matches[0].Groups[1].Value)
}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$outputRoot = (Resolve-Path $OutputDirectory).Path
$work = Join-Path $env:TEMP ('uet-handbook-layers-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $work | Out-Null
$browser = Resolve-Browser
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$jpegParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
$jpegParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [int]$JpegQuality)

try {
  foreach ($pageNumber in $FirstPage..$LastPage) {
    $label = '{0:d2}' -f $pageNumber
    $svgPath = Join-Path $work "page-$label.svg"
    $backgroundSvgPath = Join-Path $work "page-$label-bg.svg"
    $wrapperPath = Join-Path $work "page-$label.html"
    $pngPath = Join-Path $work "page-$label.png"
    $jpegPath = Join-Path $outputRoot "page-$label.jpg"

    & pdftocairo -svg -f $pageNumber -l $pageNumber $pdf $svgPath
    if ($LASTEXITCODE -ne 0) { throw "pdftocairo failed on page $pageNumber." }

    $svg = Get-Content -LiteralPath $svgPath -Raw -Encoding UTF8
    $background = Remove-SvgGlyphLayer -Svg $svg
    [System.IO.File]::WriteAllText($backgroundSvgPath, $background, $utf8NoBom)

    $style = 'html,body{margin:0;padding:0;background:#fff}img{display:block;width:' + $RenderWidth + 'px;height:' + $RenderHeight + 'px}'
    $wrapper = '<!doctype html><html><head><meta charset="utf-8"><style>' + $style + '</style></head><body><img src="page-' + $label + '-bg.svg" alt=""></body></html>'
    [System.IO.File]::WriteAllText($wrapperPath, $wrapper, $utf8NoBom)

    $arguments = @(
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
      '--force-device-scale-factor=1', '--virtual-time-budget=8000',
      ('--window-size=' + $RenderWidth + ',' + $RenderHeight),
      ('--screenshot=' + $pngPath),
      ('--user-data-dir=' + (Join-Path $work 'browser-profile')),
      ('file:///' + $wrapperPath.Replace('\', '/'))
    )
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & $browser @arguments 2>&1 | Out-Null
    $ErrorActionPreference = $previousPreference
    if (-not (Test-Path $pngPath)) { throw "Background rasterization failed on page $pageNumber." }

    $bitmap = [System.Drawing.Image]::FromFile($pngPath)
    try { $bitmap.Save($jpegPath, $jpegCodec, $jpegParameters) } finally { $bitmap.Dispose() }
    Remove-Item -LiteralPath $pngPath -Force
    Write-Host ('Page {0}: background {1} KB' -f $label, [math]::Round((Get-Item $jpegPath).Length / 1KB))
  }
} finally {
  $jpegParameters.Dispose()
  Remove-Item -LiteralPath $work -Recurse -Force -ErrorAction SilentlyContinue
}
