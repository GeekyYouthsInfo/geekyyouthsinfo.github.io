// PWA Verification Script
// Run this in browser console to check PWA status

console.log('🔍 PWA Verification Started...\n');

// Check Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
            console.log('✅ Service Worker: Registered');
            console.log('📄 Active SW:', registrations[0].active?.scriptURL);
            console.log('🔄 SW State:', registrations[0].active?.state);
        } else {
            console.log('❌ Service Worker: Not registered');
        }
    });
} else {
    console.log('❌ Service Worker: Not supported');
}

// Check Manifest
fetch('/manifest.json')
    .then(response => response.json())
    .then(manifest => {
        console.log('✅ Manifest: Available');
        console.log('📱 App Name:', manifest.name);
        console.log('🎨 Theme Color:', manifest.theme_color);
        console.log('📊 Display Mode:', manifest.display);
        console.log('🚀 Start URL:', manifest.start_url);
    })
    .catch(() => {
        console.log('❌ Manifest: Not found or invalid');
    });

// Check Cache
if ('caches' in window) {
    caches.keys().then(cacheNames => {
        if (cacheNames.length > 0) {
            console.log('✅ Cache API: Available');
            console.log('📦 Cache Names:', cacheNames);
            
            // Check cache contents
            cacheNames.forEach(cacheName => {
                caches.open(cacheName).then(cache => {
                    cache.keys().then(keys => {
                        console.log(`📂 ${cacheName} contains ${keys.length} items`);
                    });
                });
            });
        } else {
            console.log('⚠️ Cache API: No caches found');
        }
    });
} else {
    console.log('❌ Cache API: Not supported');
}

// Check offline capability
console.log('🌐 Network Status:', navigator.onLine ? 'Online' : 'Offline');

// Check install prompt
if (window.deferredPrompt) {
    console.log('✅ Install Prompt: Ready');
} else {
    console.log('⚠️ Install Prompt: Not available (may already be installed)');
}

// Check push notifications
if ('Notification' in window) {
    console.log('🔔 Notifications:', Notification.permission);
} else {
    console.log('❌ Notifications: Not supported');
}

// Check background sync
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    console.log('✅ Background Sync: Supported');
} else {
    console.log('❌ Background Sync: Not supported');
}

// Performance check
if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
        console.log('⚡ Page Load Time:', Math.round(navigation.loadEventEnd - navigation.loadEventStart), 'ms');
        console.log('🏃 DOMContentLoaded:', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart), 'ms');
    }
}

// PWA Score calculation
setTimeout(() => {
    let score = 0;
    let maxScore = 7;
    
    // Service Worker (2 points)
    if ('serviceWorker' in navigator) score += 2;
    
    // Manifest (1 point)
    fetch('/manifest.json').then(() => score++).catch(() => {});
    
    // HTTPS (1 point) - assume true for local testing
    if (location.protocol === 'https:' || location.hostname === 'localhost') score++;
    
    // Cache API (1 point)
    if ('caches' in window) score++;
    
    // Background Sync (1 point)
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) score++;
    
    // Notifications (1 point)
    if ('Notification' in window) score++;
    
    setTimeout(() => {
        const percentage = Math.round((score / maxScore) * 100);
        console.log(`\n🏆 PWA Score: ${score}/${maxScore} (${percentage}%)`);
        
        if (percentage >= 85) {
            console.log('🎉 Excellent! Your PWA is fully featured!');
        } else if (percentage >= 70) {
            console.log('👍 Good! Your PWA has most features implemented.');
        } else {
            console.log('⚠️ Your PWA needs some improvements.');
        }
    }, 1000);
}, 2000);

console.log('\n🔍 PWA Verification Complete! Check results above.');
