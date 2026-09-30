$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8085/")
$listener.Start()
Write-Host "Server running at http://localhost:8085/"
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $rawPath = $request.Url.LocalPath
        if ($rawPath -eq "/") { $rawPath = "/index.html" }
        $filePath = Join-Path "C:\Users\student\.gemini\antigravity\scratch\studyhub" $rawPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            if ($filePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath.EndsWith(".css")) { $response.ContentType = "text/css; charset=utf-8" }
            elseif ($filePath.EndsWith(".js")) { $response.ContentType = "application/javascript; charset=utf-8" }
            $response.ContentLength64 = [long]$bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        Write-Host "Error processing request: $_"
    }
}
