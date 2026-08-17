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

// Функція для відновлення стану вікон при завантаженні сторінки
function restoreWindowStates() {
    console.log('🔄 Відновлення стану вікон...');
    
    // Мапа дій для відкриття кожного вікна
    const openActions = {
        'settings-window': () => document.getElementById('settings-btn')?.click(),
        'planet-window': () => document.querySelectorAll('#buttons button')[1]?.click(),
        'map-window': () => document.querySelectorAll('#buttons button')[2]?.click(),
        'fleet-window': () => document.querySelectorAll('#buttons button')[4]?.click(),
        'science-main-window': () => document.getElementById('science-btn')?.click(),
        'projects-window': () => document.querySelectorAll('#buttons button')[7]?.click(),
        // Для динамічних вікон, які не мають кнопок, ми просто покажемо їх, якщо вони були відкриті
        'terra-window': () => window.renderTeraWindow && window.renderTeraWindow(),
    };

    for (const windowId in windowStates) {
        const state = windowStates[windowId];
        if (state.isOpen) {
            console.log(`  -> Відкриття вікна: ${windowId}`);
            if (openActions[windowId]) {
                // Використовуємо setTimeout, щоб уникнути проблем з порядком завантаження скриптів
                setTimeout(() => {
                    openActions[windowId]();
                    
                    // Відновлюємо позицію після короткої затримки
                    setTimeout(() => {
                        const windowEl = document.getElementById(windowId);
                        if (windowEl && state.position) {
                            windowEl.style.transform = 'none'; // Скидаємо transform для точного позиціонування
                            windowEl.style.left = state.position.left;
                            windowEl.style.top = state.position.top;
                            console.log(`  -> Відновлено позицію для ${windowId}:`, state.position);
                        }
                    }, 200);
                }, 100);
            }
        }
    }
}

// Завантажуємо стан при старті
loadWindowStates();

// Відновлюємо вікна після завантаження DOM
document.addEventListener('DOMContentLoaded', restoreWindowStates);

// Експортуємо функції для глобального використання
window.windowManager = {
    update: updateWindowState,
    get: getWindowState,
};

// Додаємо обробник beforeunload для збереження стану перед закриттям сторінки
window.addEventListener('beforeunload', () => {
    // Оновлюємо стан всіх видимих вікон перед закриттям
    const allWindows = document.querySelectorAll('.science-details-window, .game-settings-window, #planet-window, #map-window, #fleet-window, #projects-window');
    allWindows.forEach(win => {
        if (win.style.display !== 'none' && win.id) {
            updateWindowState(win.id, true, {
                left: win.style.left,
                top: win.style.top
            });
        }
    });
    console.log('💾 Збережено стан вікон перед оновленням.');
});