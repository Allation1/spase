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
                    windowEl.style.transform = 'none';
                    windowEl.style.left = state.position.left;
                    windowEl.style.top = state.position.top;
                }
            }, 200);
        }, 100);
    }
}

function resetOpenWindowStates() {
    for (const windowId in windowStates) {
        windowStates[windowId].isOpen = false;
    }

    saveWindowStates();
}

// Завантажуємо стан при старті
loadWindowStates();

document.addEventListener('DOMContentLoaded', () => {
    if (isPageReload()) {
        restoreWindowStates();
    } else {
        resetOpenWindowStates();
    }
});

// Експортуємо функції для глобального використання
window.windowManager = {
    update: updateWindowState,
    get: getWindowState,
};

// Додаємо обробник beforeunload для збереження стану перед закриттям сторінки
window.addEventListener('beforeunload', () => {
    // Оновлюємо стан всіх видимих вікон перед закриттям
    // Зберігаємо тільки основні вікна, а не всі динамічні
    const windowsToSave = [
        'settings-window', 'planet-window', 'map-window', 'fleet-window', 
        'science-main-window', 'projects-window', 'terra-window'
    ];

    windowsToSave.forEach(windowId => {
        const win = document.getElementById(windowId);
        if (!win) {
            updateWindowState(windowId, false);
            return;
        }

        const isVisible = getComputedStyle(win).display !== 'none';
        if (isVisible) {
            const rect = win.getBoundingClientRect();
            updateWindowState(windowId, true, { left: `${rect.left}px`, top: `${rect.top}px` });
        } else {
            updateWindowState(windowId, false);
        }
    });
    console.log('💾 Збережено стан вікон перед оновленням.');
});
