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
                if (typeof bringWindowToFront === 'function') bringWindowToFront(settingsWindow);
            } else {
                settingsWindow.style.display = 'none';
            }
        });

        // Логіка перетягування (Drag & Drop)
        const titleBar = settingsWindow.querySelector('.science-window-title');
        let isDragging = false, offsetX = 0, offsetY = 0;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - settingsWindow.offsetLeft;
            offsetY = e.clientY - settingsWindow.offsetTop;
            document.body.style.userSelect = 'none';
            if (typeof bringWindowToFront === 'function') bringWindowToFront(settingsWindow);
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                settingsWindow.style.left = (e.clientX - offsetX) + 'px';
                settingsWindow.style.top = (e.clientY - offsetY) + 'px';
                settingsWindow.style.transform = 'none'; // Прибираємо центрування при русі
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
}

window.closeSettingsWindow = function() {
    document.getElementById('settings-window').style.display = 'none';
};