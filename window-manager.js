/**
 * 🪟 Файл: window-manager.js
 * 🪟 Призначення: Керування станом (позиція, видимість) вікон та їх збереження/відновлення.
 */

// Об'єкт для зберігання стану вікон
let windowStates = {};

// Функція для завантаження стану вікон з localStorage
function loadWindowStates() {
    const savedStates = localStorage.getItem('windowStates');
    if (savedStates) {
        windowStates = JSON.parse(savedStates);
    }
}

// Функція для збереження стану вікон у localStorage
function saveWindowStates() {
    localStorage.setItem('windowStates', JSON.stringify(windowStates));
}

// Функція для оновлення стану конкретного вікна
function updateWindowState(windowId, isOpen, position) {
    if (!windowStates[windowId]) {
        windowStates[windowId] = {};
    }
    
    // Оновлюємо тільки передані значення
    if (isOpen !== undefined) {
        windowStates[windowId].isOpen = isOpen;
    }
    if (position) {
        windowStates[windowId].position = position;
    }
    
    saveWindowStates();
}

// Функція для отримання стану вікна
function getWindowState(windowId) {
    return windowStates[windowId] || { isOpen: false, position: null };
}

function isPageReload() {
    const navigationEntry = performance.getEntriesByType?.('navigation')?.[0];
    if (navigationEntry) {
        return navigationEntry.type === 'reload';
    }

    return performance.navigation?.type === performance.navigation?.TYPE_RELOAD;
}

function centerAllWindowsOnLoad() {
    const allWindows = document.querySelectorAll('.science-details-window, .game-settings-window, #planet-window, #map-window, #fleet-window, #projects-window, .solar-system-window');
    const windowsToSave = ['settings-window', 'planet-window', 'map-window', 'fleet-window', 'science-main-window', 'projects-window', 'terra-window'];

    allWindows.forEach(win => {
        if (win.id) {
            win.style.left = '50%';
            win.style.top = '50%';
            win.style.transform = 'translate(-50%, -50%)';
            // Оновлюємо збережену позицію на центральну
            if (windowsToSave.includes(win.id)) {
                updateWindowState(win.id, undefined, { left: '50%', top: '50%' });
            }
        }
    });
}

function restoreWindowStates() {
    const openActions = {
        'settings-window': () => document.getElementById('settings-btn')?.click(),
        'planet-window': () => document.querySelectorAll('#buttons button')[1]?.click(),
        'map-window': () => document.querySelectorAll('#buttons button')[2]?.click(),
        'fleet-window': () => document.querySelectorAll('#buttons button')[4]?.click(),
        'science-main-window': () => document.getElementById('science-btn')?.click(),
        'projects-window': () => document.querySelectorAll('#buttons button')[7]?.click(),
        'terra-window': () => window.renderTeraWindow && window.renderTeraWindow(),
    };

    for (const windowId in windowStates) {
        const state = windowStates[windowId];
        if (!state.isOpen || !openActions[windowId]) continue;

        setTimeout(() => {
            openActions[windowId]();

            setTimeout(() => {
                const windowEl = document.getElementById(windowId);
                if (windowEl && state.position) {
                    // Якщо позиція збережена як 50%/50%, використовуємо transform
                    if (state.position.left === '50%' && state.position.top === '50%') {
                        windowEl.style.transform = 'translate(-50%, -50%)';
                    } else {
                        windowEl.style.transform = 'none';
                    }
                    windowEl.style.left = state.position.left || '50%';
                    windowEl.style.top = state.position.top || '50%';
                }
            }, 150);
        }, 100);
    }
}

// Функція для скидання позицій всіх вікон
function resetAllWindowsPosition() {
    console.log('🔄 Скидання позицій всіх вікон...');
    for (const windowId in windowStates) {
        const windowEl = document.getElementById(windowId);
        if (windowEl && windowEl.style.display !== 'none') {
            // Скидаємо позицію на центр
            windowEl.style.left = '50%';
            windowEl.style.top = '50%';
            windowEl.style.transform = 'translate(-50%, -50%)';
            
            // Оновлюємо збережений стан
            const rect = windowEl.getBoundingClientRect();
            updateWindowState(windowId, true, { left: `${rect.left}px`, top: `${rect.top}px` });
            console.log(`  -> Позицію вікна ${windowId} скинуто.`);
        }
    }
    alert('Позиції всіх відкритих вікон було скинуто.');
}

window.resetAllWindowsPosition = resetAllWindowsPosition;

// Завантажуємо стан при старті
loadWindowStates();

document.addEventListener('DOMContentLoaded', () => {
    centerAllWindowsOnLoad(); // Спочатку центруємо всі вікна
    restoreWindowStates();    // Потім відновлюємо їх стан (видимість)
});

// Експортуємо менеджер для глобального використання
window.windowManager = {
    update: updateWindowState,
    get: getWindowState,
};

// Додаємо обробник beforeunload для збереження стану перед закриттям сторінки
window.addEventListener('beforeunload', () => {
    const windowsToSave = [
        'settings-window', 'planet-window', 'map-window', 'fleet-window', 
        'science-main-window', 'projects-window', 'terra-window'
    ];

    windowsToSave.forEach(windowId => {
        const win = document.getElementById(windowId);
        if (win && win.style.display !== 'none' && getComputedStyle(win).display !== 'none') {
            const rect = win.getBoundingClientRect();
            updateWindowState(windowId, true, { left: `${rect.left}px`, top: `${rect.top}px` });
        } else {
            updateWindowState(windowId, false);
        }
    });
    console.log('💾 Збережено стан вікон перед оновленням.');
});
