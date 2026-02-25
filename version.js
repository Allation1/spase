/**
 * 🟢 Файл: version.js
 * 🟢 Призначення: Віджет версії гри з історією змін
 */

document.addEventListener('DOMContentLoaded', function() {
    const versionLabel = document.getElementById('version-label');
    const versionTooltip = document.getElementById('version-tooltip');
    const versionWidget = document.getElementById('version-widget');
    
    // Завантажуємо дані з version.json
    fetch('version.json')
        .then(response => response.json())
        .then(data => {
            // Оновлюємо напис версії
            versionLabel.textContent = `v${data.version}`;
            
            // Генеруємо HTML для tooltip
            versionTooltip.innerHTML = generateTooltipHTML(data);
        })
        .catch(error => {
            console.error('Помилка завантаження version.json:', error);
            versionLabel.textContent = 'v1.0.0';
            versionTooltip.innerHTML = '<p style="color: #aaa;">Інформація про версію недоступна</p>';
        });
    
    // Відкриття/закриття по кліку
    versionLabel.addEventListener('click', function(e) {
        e.stopPropagation();
        versionTooltip.classList.toggle('visible');
    });
    
    // Закриття при кліку на хрестик
    versionTooltip.addEventListener('click', function(e) {
        if (e.target.classList.contains('version-tooltip-close')) {
            versionTooltip.classList.remove('visible');
        }
    });
    
    // Закриття при кліку поза віджетом
    document.addEventListener('click', function(e) {
        if (!versionWidget.contains(e.target)) {
            versionTooltip.classList.remove('visible');
        }
    });
    
    // Закриття по клавіші Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            versionTooltip.classList.remove('visible');
        }
    });
});

/**
 * Генерує HTML для tooltip з даними версії
 */
function generateTooltipHTML(data) {
    let html = `
        <div class="version-tooltip-header">
            <div>
                <div class="version-tooltip-title">🎮 Версія ${data.version}</div>
                <div class="version-tooltip-date">📅 ${data.date || ''}</div>
            </div>
            <button class="version-tooltip-close" onclick="document.getElementById('version-tooltip').classList.remove('visible')">×</button>
        </div>
        <ul class="version-changes-list">
    `;
    
    // Додаємо зміни
    if (data.changes && data.changes.length > 0) {
        data.changes.forEach(change => {
            html += `
                <li class="version-change-item">
                    <div class="version-change-title">
                        ${change.icon || '📝'} ${change.title}
                    </div>
                    <ul class="version-change-details">
            `;
            
            if (change.details && change.details.length > 0) {
                change.details.forEach(detail => {
                    html += `<li>${detail}</li>`;
                });
            }
            
            html += `
                    </ul>
                </li>
            `;
        });
    } else {
        html += '<li class="version-change-item"><p style="color: #aaa;">Інформація про зміни відсутня</p></li>';
    }
    
    html += `</ul>`;
    
    return html;
}
