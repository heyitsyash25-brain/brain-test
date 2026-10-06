# Reliable PowerShell Static File Server for Quinfosys Quantum Brain
$port = 5500
$distPath = Join-Path $PSScriptRoot "dist"
$basePath = if (Test-Path (Join-Path $distPath "index.html") -PathType Leaf) { $distPath } else { $PSScriptRoot }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Quinfosys Quantum Brain server active at http://localhost:$port/"

    while ($listener.IsListening) {
        $ctx = $null
        try {
            $ctx = $listener.GetContext()
            $req = $ctx.Request
            $res = $ctx.Response

            $subPath = $req.Url.LocalPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            if ([string]::IsNullOrWhiteSpace($subPath)) {
                $subPath = "index.html"
            }
            if ($basePath -eq $distPath -and $subPath -in @("signin", "signup", "dashboard")) {
                $subPath = "index.html"
            }

            $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($basePath, $subPath))
            if (-not $fullPath.StartsWith($basePath, [System.StringComparison]::OrdinalIgnoreCase)) {
                $res.StatusCode = 403
                $res.Close()
                continue
            }

            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
                $res.ContentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".htm"  { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".mjs"  { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    default { "application/octet-stream" }
                }

                $fileBytes = [System.IO.File]::ReadAllBytes($fullPath)
                $res.AddHeader("Access-Control-Allow-Origin", "*")
                $res.AddHeader("Cache-Control", "no-cache")
                $res.ContentLength64 = $fileBytes.Length
                $res.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                $res.OutputStream.Flush()
                $res.Close()
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $subPath")
                $res.ContentLength64 = $msg.Length
                $res.OutputStream.Write($msg, 0, $msg.Length)
                $res.OutputStream.Flush()
                $res.Close()
            }
        } catch {
            if ($ctx -and $ctx.Response) {
                try { $ctx.Response.Close() } catch {}
            }
        }
    }
} catch {
    Write-Error $_
} finally {
    if ($listener.IsListening) { $listener.Stop() }
}
