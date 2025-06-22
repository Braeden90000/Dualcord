// Simple token injection - NO REDIRECT
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    console.log('Injecting token:', token.substring(0, 10) + '...');
    localStorage.setItem('token', `"${token}"`);
}