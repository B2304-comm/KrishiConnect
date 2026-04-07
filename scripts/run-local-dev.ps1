Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Resolve-Python {
  $candidates = @(
    (Join-Path $repoRoot ".venv\Scripts\python.exe"),
    (Join-Path $repoRoot ".venv-1\Scripts\python.exe")
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  return "python"
}

function Wait-For-AiBackend {
  param(
    [int]$TimeoutSeconds = 20
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-RestMethod -Uri "http://127.0.0.1:8001/healthz" -Method Get -TimeoutSec 2
      if ($response.status -eq "ok") {
        return $true
      }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }

  return $false
}

$pythonExe = Resolve-Python
$logDir = Join-Path $repoRoot "ai"
$stdoutLog = Join-Path $logDir "ai-backend.stdout.log"
$stderrLog = Join-Path $logDir "ai-backend.stderr.log"
$pidFile = Join-Path $logDir "ai-backend.pid"

if (Test-Path $pidFile) {
  $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    $runningProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($runningProcess) {
      Write-Host "AI backend already running on port 8001 (PID $existingPid)." -ForegroundColor Green
    }
  }
}

if (-not (Wait-For-AiBackend -TimeoutSeconds 1)) {
  Write-Host "Starting AI backend on http://127.0.0.1:8001 ..." -ForegroundColor Cyan
  $backendProcess = Start-Process `
    -FilePath $pythonExe `
    -ArgumentList @("-m", "uvicorn", "api:app", "--host", "127.0.0.1", "--port", "8001", "--app-dir", "ai") `
    -WorkingDirectory $repoRoot `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -PassThru

  Set-Content -Path $pidFile -Value $backendProcess.Id

  if (-not (Wait-For-AiBackend -TimeoutSeconds 20)) {
    if (-not $backendProcess.HasExited) {
      Stop-Process -Id $backendProcess.Id -Force
    }
    throw "AI backend failed to start. Check ai\ai-backend.stderr.log for details."
  }
}

Write-Host "AI backend is ready. Starting Vite dev server..." -ForegroundColor Green
npm run dev
