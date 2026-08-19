/**
 * ⚙️ Файл: settings-window.js
 * ⚙️ Призначення: Логіка та інтерфейс вікна налаштувань
 */

document.addEventListener('DOMContentLoaded', function() {
    initSettingsWindow();
});

function initSettingsWindow() {
    // 1. Створюємо HTML структуру вікна, якщо її ще немає
    if (!document.getElementById('settings-window')) {
        const windowHtml = `
            <div id="settings-window" class="game-settings-window" style="display:none;">
                <button class="science-close-btn" onclick="closeSettingsWindow()">✕</button>
                <div class="science-window-title">Налаштування гри</div>
                <div class="game-settings-content">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Звук ефектів</label>
                        <input type="range" min="0" max="100" value="50" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px;">Музика космосу</label>
                        <input type="range" min="0" max="100" value="30" style="width: 100%;">
                    </div>
                    <div style="margin-top: 20px; border-top: 1px solid #1fa2c7; padding-top: 15px;">
                        <button id="reset-windows-btn" style="
                            width: 100%;
                            padding: 8px;
                            background: #17607a;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            cursor: pointer;
                        ">Скинути позиції вікон</button>
                    </div>
                    <p style="color: #aaa; font-size: 0.8em; text-align: center; margin-top: 30px;">
                        Версія проекту: ${document.getElementById('version-label')?.textContent || 'v1.0.0'}
                    </p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', windowHtml);
    }

    const settingsBtn = document.getElementById('settings-btn');
    const settingsWindow = document.getElementById('settings-window');

    if (settingsBtn && settingsWindow) {
        // Відкриття/Закриття
        settingsBtn.addEventListener('click', function() {
            if (settingsWindow.style.display === 'none' || settingsWindow.style.display === '') {
                settingsWindow.style.display = 'block';
                window.windowManager?.update('settings-window', true);
                if (typeof bringWindowToFront === 'function') bringWindowToFront(settingsWindow);
            } else {
                window.windowManager?.update('settings-window', false);
                settingsWindow.style.display = 'none';
            }
        });

        // Додаємо можливість перетягування
        makeDraggable(settingsWindow);

        // Додаємо обробник для нової кнопки
        const resetWindowsBtn = document.getElementById('reset-windows-btn');
        if (resetWindowsBtn) {
            resetWindowsBtn.addEventListener('click', () => {
                window.resetAllWindowsPosition && window.resetAllWindowsPosition();
            });
        }
    }
}

// Функція-хелпер, якщо вона не визначена глобально
if (typeof window.constrainPosition === 'undefined') {
    window.constrainPosition = function(element, newLeft, newTop) {
        const constrainedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
        const constrainedTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
        return { left: constrainedLeft, top: constrainedTop };
    }
}

window.closeSettingsWindow = function() {
    window.windowManager?.update('settings-window', false);
    document.getElementById('settings-window').style.display = 'none';
};