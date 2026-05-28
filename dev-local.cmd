@echo off
REM Starts Vite directly using node to avoid npm shim issues
node "%~dp0node_modules\vite\bin\vite.js"
