const { app, BrowserWindow } = require('electron');
const path = require('path');

// Set app name
app.name = 'DualCord';

function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        title: 'DualCord',
        icon: path.join(__dirname, 'icon.ico'),
        autoHideMenuBar: true,
        webPreferences: {
            webviewTag: true,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: true
        }
    });

    win.loadFile('index.html');
    
    // DevTools disabled
    // win.webContents.openDevTools();
}

// Set app ID for Windows
if (process.platform === 'win32') {
    app.setAppUserModelId('com.braeden.dualcord');
}

// Disable Discord app detection
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-ipc-flooding-protection');

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});