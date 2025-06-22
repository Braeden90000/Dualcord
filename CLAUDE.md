# Discord Dual Account Client - Technical Documentation

## Architecture Overview

This application is built using **Electron** to create a desktop application that embeds Discord's web interface in a controlled environment. The core concept uses **4 webviews** to provide dual account functionality:

- **2 Sidebar webviews** (72px wide) - Show only server icons from each account
- **2 Main webviews** (remaining width) - Show full Discord interface for each account

## File Structure & Purpose

### Core Files

#### `index.html`
The main application interface containing:
- **HTML Structure** - Container divs for sidebar and main view areas
- **CSS Styling** - Discord-like dark theme and responsive layout
- **JavaScript Logic** - Account switching, event handling, and webview management

#### `main.js`
Electron's main process file that:
- **Creates the BrowserWindow** with specific security settings
- **Disables web security** to allow Discord to load properly
- **Applies command line switches** to prevent Discord app detection
- **Loads index.html** as the main interface

#### `simple-preload.js`
Token injection script that:
- **Extracts Discord tokens** from URL parameters
- **Injects tokens into localStorage** for automatic authentication
- **Runs in each webview** before Discord loads

#### `package.json`
Node.js package configuration with:
- **Electron dependency** (only required dependency)
- **Start script** to launch the application
- **Project metadata** and configuration

## Technical Implementation Details

### Webview Architecture

The application uses Electron's `<webview>` tags to embed Discord:

```html
<webview id="sidebar1" 
         class="sidebar-webview hidden" 
         src="https://discord.com/channels/@me?token=TOKEN_HERE" 
         partition="persist:account1"
         preload="./simple-preload.js">
</webview>
```

Key attributes:
- **`src`** - Discord URL with token parameter for authentication
- **`partition`** - Separate session storage for each account
- **`preload`** - Script to inject tokens before Discord loads

### Token Injection System

The token injection works through a multi-step process:

1. **URL Parameters** - Tokens are passed as URL query parameters
2. **Preload Script** - `simple-preload.js` runs before Discord loads
3. **localStorage Injection** - Tokens are stored in Discord's expected format
4. **Automatic Authentication** - Discord reads tokens and logs in automatically

```javascript
// simple-preload.js
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    localStorage.setItem('token', `"${token}"`);
}
```

### CSS Injection for Sidebar Cropping

The sidebar webviews use CSS injection to show only Discord's server icons:

```javascript
const sidebarCSS = `
    /* Hide everything first */
    * {
        visibility: hidden !important;
    }
    
    /* Show only server list container */
    .itemsContainer_ef3116,
    [class*="itemsContainer"],
    [class*="guilds"] {
        visibility: visible !important;
        position: fixed !important;
        top: 30px !important;
        left: 0 !important;
        width: 72px !important;
        height: calc(100vh - 60px) !important;
        z-index: 9999 !important;
        overflow: hidden !important;
    }
`;
```

This approach:
- **Hides everything** with `visibility: hidden`
- **Shows only server containers** using Discord's CSS class names
- **Positions absolutely** to ensure 72px width constraint
- **Handles multiple selectors** in case Discord changes class names

### Account Switching Mechanism

Account switching uses visibility toggling without reloading:

```javascript
function instantSwitch(clickedUrl) {
    if (activeSidebar === 1) {
        // Show account 2 sidebar, account 1 main
        sidebar1.className = 'sidebar-webview hidden';
        sidebar2.className = 'sidebar-webview visible';
        main1.className = 'main-webview visible';
        main2.className = 'main-webview hidden';
        
        // Navigate to clicked URL
        main1.executeJavaScript(`history.pushState(null, null, '${clickedUrl}');`);
        
        activeSidebar = 2;
        activeMain = 1;
    } else {
        // Opposite logic for account 2 clicks
    }
}
```

Key benefits:
- **No page reloads** - Uses visibility instead of src changes
- **Instant switching** - No loading time between accounts
- **State preservation** - Both accounts stay logged in and maintain state
- **URL navigation** - Uses `history.pushState` for Discord's router

### Event Handling System

The app listens for navigation events on sidebar webviews:

```javascript
sidebar1.addEventListener('did-navigate-in-page', (e) => {
    if (e.url.includes('/channels/')) {
        instantSwitch(e.url);
    }
});

sidebar2.addEventListener('will-navigate', (e) => {
    if (e.url.includes('/channels/')) {
        instantSwitch(e.url);
    }
});
```

Event types:
- **`did-navigate-in-page`** - After navigation completes
- **`will-navigate`** - Before navigation starts
- **URL filtering** - Only responds to Discord channel/server URLs

### Link Handling Enhancement

Custom link handling for external URLs:

```javascript
main1.executeJavaScript(`
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && 
            !link.href.includes('discord.com/channels/') &&
            !link.href.includes('discord.com/users/')) {
            e.preventDefault();
            if (e.shiftKey) {
                require('electron').shell.openExternal(link.href);
            } else {
                navigator.clipboard.writeText(link.href);
            }
        }
    }, true);
`);
```

Features:
- **Normal click** - Copies link to clipboard
- **Shift+click** - Opens link in default browser
- **URL filtering** - Only applies to external links, not Discord navigation
- **Event prevention** - Stops Discord's default link handling

### Modal Blocking System

Prevents Discord's "open in app" detection:

```javascript
setInterval(() => {
    document.querySelectorAll('.downloadAppModal-1jWq_W, [class*="downloadApp"]').forEach(el => {
        el.style.display = 'none';
        el.remove();
    });
}, 100);
```

Approach:
- **Targeted blocking** - Only removes app detection modals
- **Preserves functionality** - Allows image previews and other modals
- **Continuous monitoring** - Runs every 100ms to catch new modals
- **Immediate removal** - Both hides and removes elements

### Security Configuration

Electron security settings in `main.js`:

```javascript
webPreferences: {
    webviewTag: true,           // Enable webview tags
    nodeIntegration: true,      // Allow Node.js in renderer
    contextIsolation: false,    // Disable context isolation
    webSecurity: false,         // Allow cross-origin requests
    allowRunningInsecureContent: true
}
```

Command line switches:
```javascript
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-ipc-flooding-protection');
```

Purpose:
- **Allow Discord loading** - Bypass CORS and security restrictions
- **Prevent app detection** - Disable features Discord uses to detect desktop clients
- **Maintain performance** - Prevent throttling of background processes

## Data Flow

### Initialization Sequence

1. **Electron starts** → Loads `main.js`
2. **BrowserWindow created** → Loads `index.html`
3. **Webviews created** → Each loads Discord with token parameter
4. **Preload scripts run** → Inject tokens into localStorage
5. **Discord loads** → Automatic authentication using injected tokens
6. **CSS injection** → Crop sidebar webviews to show only server icons
7. **Event listeners attached** → Enable account switching functionality

### Account Switching Flow

1. **User clicks server icon** → Navigation event triggered
2. **Event listener detects** → Calls `instantSwitch(url)`
3. **Visibility toggled** → Hide/show appropriate webviews
4. **URL navigation** → Update active webview to clicked URL
5. **State updated** → Track active sidebar/main combination

### Link Interaction Flow

1. **User clicks link** → Custom event handler triggered
2. **Link type detected** → External vs Discord navigation
3. **Action performed** → Copy to clipboard or open in browser
4. **Default prevented** → Stop Discord's normal link handling

## Performance Considerations

### Memory Usage
- **4 webviews total** - Each runs a full Discord instance
- **Separate processes** - Electron isolates each webview
- **Session partitioning** - Prevents account data mixing

### CPU Optimization
- **Background throttling disabled** - Maintains responsiveness
- **Visibility-based switching** - No process recreation
- **CSS-only sidebar cropping** - No DOM manipulation overhead

### Network Efficiency
- **Persistent connections** - WebSocket connections maintained
- **No token refreshing** - Tokens injected once at startup
- **Cached resources** - Discord assets cached per partition

## Debugging & Development

### Console Access
Enable DevTools in `main.js`:
```javascript
win.webContents.openDevTools();
```

### Webview Debugging
Each webview can be inspected separately through Electron's debugging tools.

### Common Issues

1. **Token format errors** - Ensure tokens are properly quoted in localStorage
2. **CSS class changes** - Discord may update CSS class names
3. **Event timing** - DOM ready vs navigation events
4. **Security restrictions** - CORS or content security policy blocks

## Security Model

### Threat Considerations
- **Token exposure** - Tokens visible in URL parameters and localStorage
- **XSS vulnerabilities** - Disabled web security increases attack surface
- **Process isolation** - Limited by Electron's security model

### Mitigation Strategies
- **Local execution only** - No network token transmission
- **Session partitioning** - Account data separation
- **Minimal permissions** - Only required Electron features enabled
- **Source code transparency** - Open implementation for security review

## Extension Points

### Adding Features
- **Custom CSS themes** - Modify Discord appearance
- **Additional accounts** - Extend webview system
- **Notification handling** - Intercept Discord notifications
- **Keyboard shortcuts** - Add global hotkeys for switching

### Configuration Options
- **Window sizing** - Modify BrowserWindow dimensions
- **Token management** - External token storage/rotation
- **Theme customization** - Dynamic CSS injection
- **Performance tuning** - Adjust refresh intervals and timeouts

This technical documentation provides a comprehensive understanding of the Discord Dual Account Client's architecture, implementation details, and operational characteristics.