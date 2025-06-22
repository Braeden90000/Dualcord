' DualCord Launcher - No Console Window
Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
strPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Change to the script directory
objShell.CurrentDirectory = strPath

' Check if Node.js is installed
On Error Resume Next
objShell.Run "node --version", 0, True
If Err.Number <> 0 Then
    MsgBox "Node.js is not installed!" & vbCrLf & vbCrLf & _
           "Please install Node.js from https://nodejs.org/" & vbCrLf & _
           "Then run this launcher again.", vbCritical, "DualCord - Error"
    WScript.Quit
End If
On Error GoTo 0

' Check if node_modules exists
If Not objFSO.FolderExists(strPath & "\node_modules") Then
    ' Need to install - show a message
    result = MsgBox("First time setup required." & vbCrLf & vbCrLf & _
                    "Click OK to install DualCord (this may take a minute)." & vbCrLf & _
                    "The app will start automatically when ready.", _
                    vbOKCancel + vbInformation, "DualCord - Setup")
    
    If result = vbCancel Then
        WScript.Quit
    End If
    
    ' Run npm install with visible window for first-time setup
    objShell.Run "cmd /c npm install && echo Installation complete! Starting DualCord... && timeout /t 2", 1, True
End If

' Check if tokens are the exact placeholder values
Set objFile = objFSO.OpenTextFile(strPath & "\index.html", 1)
strContent = objFile.ReadAll
objFile.Close

If InStr(strContent, "const DISCORD_TOKEN_1 = 'DISCORD_TOKEN_1';") > 0 Or _
   InStr(strContent, "const DISCORD_TOKEN_2 = 'DISCORD_TOKEN_2';") > 0 Then
    MsgBox "Discord tokens not configured!" & vbCrLf & vbCrLf & _
           "Please edit index.html and add your Discord tokens." & vbCrLf & _
           "Look for 'DISCORD TOKENS - CHANGE THESE!' at the top of the script section." & vbCrLf & vbCrLf & _
           "Replace DISCORD_TOKEN_1 and DISCORD_TOKEN_2 with your actual tokens.", _
           vbExclamation, "DualCord - Token Setup Required"
    
    ' Open index.html in default editor
    objShell.Run "notepad.exe """ & strPath & "\index.html""", 1, False
    WScript.Quit
End If

' Run the app without console window
objShell.Run "npm start", 0, False
