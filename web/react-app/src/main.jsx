import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Handle unhandled promise rejections (common with Chrome extensions)
window.addEventListener('unhandledrejection', (event) => {
    // Suppress the Chrome extension message passing error
    if (event.reason && 
        typeof event.reason === 'object' && 
        event.reason.message && 
        event.reason.message.includes('message channel closed')) {
        event.preventDefault();
        console.debug('Suppressed Chrome extension message channel error:', event.reason.message);
        return;
    }
    
    // Suppress if it's the specific async response error
    if (event.reason && 
        typeof event.reason === 'object' && 
        event.reason.message && 
        event.reason.message.includes('listener indicated an asynchronous response')) {
        event.preventDefault();
        console.debug('Suppressed Chrome extension async response error:', event.reason.message);
        return;
    }
});

// Also handle general error events
window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('message channel closed')) {
        event.preventDefault();
        console.debug('Suppressed Chrome extension message channel error:', event.message);
        return;
    }
    
    if (event.message && event.message.includes('listener indicated an asynchronous response')) {
        event.preventDefault();
        console.debug('Suppressed Chrome extension async response error:', event.message);
        return;
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
