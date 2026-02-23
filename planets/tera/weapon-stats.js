
// Функція для відкриття характеристик лазерної гармати
async function openLaserWeaponStats(weaponLevel) {
    const statsWindow = document.getElementById('weapon-stats-window');
    const statsContent = document.getElementById('weapon-stats-content');

    let productionData = {};
    try {
        const response = await fetch('/planets/tera/production.json');
        if (response.ok) productionData = await response.json();
    } catch (e) { console.error('Помилка при отриманні даних виробництва:', e); }

    let laserWeaponLevel = 0;
    try {
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            laserWeaponLevel = levels.weapon_laser || 0;
        }
    } catch (e) { console.error('Помилка при отриманні рівня науки:', e); }

    // Фільтруємо зброю за рівнем, якщо передано рівень
    let weaponsToDisplay = [];
    if (productionData.weapons?.laser && Array.isArray(productionData.weapons.laser)) {
        weaponsToDisplay = productionData.weapons.laser.filter(l => l.count > 0);
        if (weaponLevel !== undefined) {
            weaponsToDisplay = weaponsToDisplay.filter(l => l.level === weaponLevel);
        }
        weaponsToDisplay.sort((a, b) => a.level - b.level);
    }

    let weaponsHtml = '';
    if (weaponsToDisplay.length === 0) {
        weaponsHtml = '<p style="color: #aaa; text-align: center;">Немає зброї</p>';
    } else {
        weaponsToDisplay.forEach(weapon => {
            const damage = weapon.level;
            const range = 10;
            weaponsHtml += '<div style="background: #134d5c; border: 1px solid #1fa2c7; border-radius: 4px; padding: 15px; margin-bottom: 15px;">';
            weaponsHtml += '<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #1fa2c7;">🔫 Лазерна гармата ' + weapon.level + ' рівня</div>';
            weaponsHtml += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">';
            weaponsHtml += '<div style="background: #0e3a47; padding: 10px; border-radius: 4px;"><div style="color: #aaa; font-size: 0.85em;">⚔️ Урон</div><div style="font-size: 1.5em; color: #ef4444; font-weight: bold;">' + damage + '</div></div>';
            weaponsHtml += '<div style="background: #0e3a47; padding: 10px; border-radius: 4px;"><div style="color: #aaa; font-size: 0.85em;">🎯 Дальність</div><div style="font-size: 1.5em; color: #3b82f6; font-weight: bold;">' + range + '</div></div>';
            weaponsHtml += '</div>';
            weaponsHtml += '<div style="margin-top: 10px; padding: 10px; background: #0e3a47; border-radius: 4px;"><div style="color: #aaa; font-size: 0.85em;">📦 Кількість</div><div style="font-size: 1.2em; color: #4ade80; font-weight: bold;">' + weapon.count + ' шт</div></div>';
            weaponsHtml += '<div style="margin-top: 10px; padding: 10px; background: #0e3a47; border-radius: 4px;"><div style="color: #aaa; font-size: 0.85em;">💥 Загальний урон за залп</div><div style="font-size: 1.2em; color: #f59e0b; font-weight: bold;">' + (damage * weapon.count) + '</div></div>';
            weaponsHtml += '</div>';
        });
    }

    statsContent.innerHTML = '<div style="padding: 15px;">';
    statsContent.innerHTML += '<div style="margin-bottom: 20px; padding: 15px; background: #134d5c; border: 1px solid #1fa2c7; border-radius: 4px;">';
    statsContent.innerHTML += '<div style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px; color: #1fa2c7;">📊 Загальна інформація</div>';
    statsContent.innerHTML += '<div style="color: #aaa; font-size: 0.9em; margin-bottom: 5px;">🔬 Вивчено рівень науки: <span style="color: #4ade80;">' + laserWeaponLevel + '</span></div>';
    statsContent.innerHTML += '<div style="color: #aaa; font-size: 0.9em;">⚙️ Формула: Урон = 1 × рівень, Дальність = 10 (постійна)</div>';
    statsContent.innerHTML += '</div>';
    statsContent.innerHTML += '<div style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px; color: #1fa2c7;">📋 Наявна зброя</div>';
    statsContent.innerHTML += weaponsHtml;
    statsContent.innerHTML += '</div>';

    statsWindow.style.display = 'block';
    if (typeof bringWindowToFront === 'function') {
        bringWindowToFront(statsWindow);
    }

    // Додаємо можливість рухати вікно мишкою
    let isDragging = false, offsetX = 0, offsetY = 0;
    const titleElement = statsWindow.querySelector('.science-window-title');

    if (titleElement) {
        titleElement.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - statsWindow.offsetLeft;
            offsetY = e.clientY - statsWindow.offsetTop;
            document.body.style.userSelect = 'none';
            if (typeof bringWindowToFront === 'function') {
                bringWindowToFront(statsWindow);
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                statsWindow.style.left = (e.clientX - offsetX) + 'px';
                statsWindow.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
}

// Функція для закриття вікна характеристик
function closeWeaponStatsWindow() {
    const statsWindow = document.getElementById('weapon-stats-window');
    if (statsWindow) statsWindow.style.display = 'none';
}

// Експортуємо функції в глобальну область
window.openLaserWeaponStats = openLaserWeaponStats;
window.closeWeaponStatsWindow = closeWeaponStatsWindow;
