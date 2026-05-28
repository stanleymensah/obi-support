# Starts Vite directly using node to avoid npm shim issues
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
node "$scriptDir\node_modules\vite\bin\vite.js"
