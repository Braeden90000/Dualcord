@echo off
echo Creating DualCord desktop shortcut...

:: First, create the icon if it doesn't exist
if not exist "icon.png" (
    echo Creating icon...
    call create-icon.bat
)

:: Create shortcut using PowerShell
powershell -Command ^
"$WshShell = New-Object -comObject WScript.Shell; ^
$Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\DualCord.lnk'); ^
$Shortcut.TargetPath = '%CD%\DualCord.vbs'; ^
$Shortcut.WorkingDirectory = '%CD%'; ^
$Shortcut.IconLocation = '%CD%\icon.ico'; ^
$Shortcut.Description = 'Launch DualCord - Discord Dual Account Client'; ^
$Shortcut.Save()"

echo.
echo Desktop shortcut created!
echo You can now launch DualCord from your desktop.
echo.
pause