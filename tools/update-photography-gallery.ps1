param(
    [int]$PreviewWidth = 1200,
    [int]$JpegQuality = 82
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$photoDirectory = Join-Path $projectRoot "photography-gallery"
$previewDirectory = Join-Path $photoDirectory "previews"
$dataFile = Join-Path $photoDirectory "gallery-data.js"
$allowedExtensions = @(".jpg", ".jpeg", ".png")

New-Item -ItemType Directory -Path $previewDirectory -Force | Out-Null

function Get-NaturalSortKey {
    param([string]$Name)

    return [regex]::Replace($Name.ToLowerInvariant(), "\d+", {
        param($match)
        $match.Value.PadLeft(12, "0")
    })
}

function Save-JpegPreview {
    param(
        [System.Drawing.Image]$Source,
        [string]$Destination,
        [int]$MaxWidth,
        [int]$Quality
    )

    $targetWidth = [Math]::Min($MaxWidth, $Source.Width)
    $targetHeight = [Math]::Max(1, [int][Math]::Round($Source.Height * ($targetWidth / $Source.Width)))
    $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $bitmap.SetResolution(72, 72)

    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 7, 9))
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($Source, 0, 0, $targetWidth, $targetHeight)

    $jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]$Quality
    )

    $bitmap.Save($Destination, $jpegEncoder, $encoderParameters)
    $encoderParameters.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

$sourceFiles = Get-ChildItem -LiteralPath $photoDirectory -File |
    Where-Object { $allowedExtensions -contains $_.Extension.ToLowerInvariant() } |
    Sort-Object { Get-NaturalSortKey $_.Name }

$gallery = foreach ($file in $sourceFiles) {
    $previewName = "$([System.IO.Path]::GetFileNameWithoutExtension($file.Name)).jpg"
    $previewPath = Join-Path $previewDirectory $previewName
    $mustRegenerate = -not (Test-Path -LiteralPath $previewPath) -or
        $file.LastWriteTimeUtc -gt (Get-Item -LiteralPath $previewPath).LastWriteTimeUtc

    $image = [System.Drawing.Image]::FromFile($file.FullName)
    try {
        if ($mustRegenerate) {
            Save-JpegPreview -Source $image -Destination $previewPath -MaxWidth $PreviewWidth -Quality $JpegQuality
            Write-Host "Created preview: $previewName"
        }

        [ordered]@{
            full = "photography-gallery/$([uri]::EscapeDataString($file.Name))"
            preview = "photography-gallery/previews/$([uri]::EscapeDataString($previewName))"
            width = $image.Width
            height = $image.Height
            title = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        }
    }
    finally {
        $image.Dispose()
    }
}

$json = $gallery | ConvertTo-Json -Depth 3
$javascript = "window.PHOTOGRAPHY_IMAGES = $json;`n"
[System.IO.File]::WriteAllText($dataFile, $javascript, [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "Gallery updated: $($gallery.Count) images"
Write-Host "Data file: $dataFile"
