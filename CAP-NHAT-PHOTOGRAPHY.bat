@echo off
cd /d "%~dp0"
echo Dang cap nhat gallery Photography...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update-photography-gallery.ps1"
echo.
if errorlevel 1 (
    echo Cap nhat khong thanh cong. Vui long xem loi o phia tren.
) else (
    echo Da cap nhat xong. Khoa co the dong cua so nay.
)
pause
