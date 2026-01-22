@echo off
echo Iniciando servidores de desenvolvimento...
echo.

REM Abre um terminal para o frontend
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

REM Aguarda um pouco antes de abrir o segundo terminal
timeout /t 1 /nobreak >nul

REM Abre um terminal para o backend
start "Backend Dev Server" cmd /k "cd backend && npm run dev"

echo.
echo Dois terminais foram abertos:
echo - Frontend Dev Server: executando npm run dev na pasta frontend
echo - Backend Dev Server: executando npm run dev na pasta backend
echo.
pause
