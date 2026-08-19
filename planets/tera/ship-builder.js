// Функція для завантаження списку проектів
async function loadShipProjects() {
    const projectSelect = document.getElementById('ship-project-select');
    if (!projectSelect) return;

    // Отримуємо проекти з localStorage
    let projects = [];
    try {
        const savedData = localStorage.getItem('shipProjects');
        if (savedData) {
            projects = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('Помилка при отриманні проектів:', e);
    }

    // Заповнюємо випадаючий список
    projectSelect.innerHTML = '<option value="">-- Виберіть проект --</option>';
    projects.forEach((project, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${project.name} (рівень ${project.shipLevel}, ${project.weaponsCount} гармат ${project.weaponLevel > 0 ? 'рівня ' + project.weaponLevel : ''})`;
        projectSelect.appendChild(option);
    });
}

// Функція для будівництва корабля
async function buildShip() {
    const projectSelect = document.getElementById('ship-project-select');
    const countInput = document.getElementById('ship-build-count');
    const buildTimeSpan = document.getElementById('ship-build-time');
    const progressBar = document.getElementById('ship-build-progress');
    const buildBar = document.getElementById('ship-build-bar');
    const buildBtn = document.getElementById('build-ship-btn');

    // Отримуємо вибраний проект
    const projectIndex = projectSelect.value;
    if (projectIndex === '') {
        alert('❌ Виберіть проект корабля');
        return;
    }

    // Отримуємо проекти з localStorage
    let projects = [];
    try {
        const savedData = localStorage.getItem('shipProjects');
        if (savedData) {
            projects = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('Помилка при отриманні проектів:', e);
        alert('❌ Помилка завантаження проектів');
        return;
    }

    const project = projects[parseInt(projectIndex)];
    if (!project) {
        alert('❌ Проект не знайдено');
        return;
    }

    const count = parseInt(countInput.value);
    if (count < 1 || isNaN(count)) {
        alert('❌ Введіть коректну кількість (мінімум 1)');
        return;
    }

    // ПЕРЕВІРКА НАЯВНОСТІ ЗБРОЇ НА СКЛАДІ (production.json)
    const requiredWeapons = project.weaponsCount * count;
    const weaponLevel = project.weaponLevel;
    
    let productionData = null;
    
    try {
        const prodResponse = await fetch('/planets/tera/production.json?t=' + Date.now());
        productionData = { weapons: { laser: [] } };
        
        if (prodResponse.ok) {
            productionData = await prodResponse.json();
        }
        
        // Знаходимо зброю потрібного рівня
        const laserWeapons = productionData.weapons?.laser || [];
        const requiredWeapon = laserWeapons.find(w => w.level === weaponLevel);
        
        const availableCount = requiredWeapon ? requiredWeapon.count : 0;
        
        if (availableCount < requiredWeapons) {
            alert(`❌ Недостатньо зброї на складі!\n\nПотрібно: ${requiredWeapons} гармат ${weaponLevel} рівня\nНа складі: ${availableCount}\n\nВиробіть необхідну кількість зброї на Зброярному заводі.`);
            return;
        }
        
        console.log(`✅ Перевірка пройдена: потрібно ${requiredWeapons} гармат ${weaponLevel} рівня, на складі є ${availableCount}`);
        
    } catch (e) {
        console.error('Помилка при перевірці зброї:', e);
        alert('❌ Помилка перевірки зброї на складі');
        return;
    }

    // Розраховуємо час будівництва: 10с × рівень корабля × кількість
    const timePerUnit = project.shipLevel * 10 * 1000; // мс
    const totalTime = timePerUnit * count;

    // Блокуємо кнопку
    buildBtn.disabled = true;
    buildBtn.style.background = '#555';
    buildBtn.style.cursor = 'not-allowed';
    progressBar.style.display = 'block';
    buildBar.style.width = '0%';

    let startTime = Date.now();
    let remainingTime = totalTime;

    const buildInterval = setInterval(async () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalTime) * 100, 100);
        buildBar.style.width = progress + '%';

        // Оновлюємо зворотний відлік
        remainingTime = Math.max(totalTime - elapsed, 0);
        const remainingSeconds = (remainingTime / 1000).toFixed(1);
        buildTimeSpan.textContent = `⏱️ Залишилось: ${remainingSeconds}с`;

        if (elapsed >= totalTime) {
            clearInterval(buildInterval);
            buildBtn.disabled = false;
            buildBtn.style.background = '#1fa2c7';
            buildBtn.style.cursor = 'pointer';
            progressBar.style.display = 'none';
            buildTimeSpan.textContent = '';

            // ВІДНІМАЄМО ЗБРОЮ ЗІ СКЛАДУ ПІСЛЯ ЗАВЕРШЕННЯ БУДІВНИЦТВА
            if (productionData && productionData.weapons?.laser) {
                const requiredWeapon = productionData.weapons.laser.find(w => w.level === weaponLevel);
                
                if (requiredWeapon) {
                    const oldCount = requiredWeapon.count;
                    requiredWeapon.count = Math.max(0, oldCount - requiredWeapons);
                    console.log(`  Віднімання: ${oldCount} - ${requiredWeapons} = ${requiredWeapon.count}`);
                    
                    // Зберігаємо оновлений production.json
                    await fetch('/api/save-production', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productionData)
                    });
                    console.log(`✅ Використано ${requiredWeapons} гармат ${weaponLevel} рівня для будівництва`);
                    
                    // Оновлюємо відображення зброї на складі
                    if (typeof updateProductionDisplay === 'function') {
                        updateProductionDisplay();
                    }
                } else {
                    console.error('❌ ПОМИЛКА: Зброю потрібного рівня не знайдено!');
                }
            }

            // Додаємо корабель у ships.json
            saveShip(project, count);
        }
    }, 100);

    // Показуємо час
    const seconds = (totalTime / 1000).toFixed(1);
    buildTimeSpan.textContent = `⏱️ Час: ${seconds}с`;
}

// Функція для збереження корабля у ships.json
async function saveShip(project, count) {
    try {
        // Отримуємо поточні дані
        const response = await fetch('/planets/tera/ships.json');
        let shipsData = { ships: [] };

        if (response.ok) {
            shipsData = await response.json();
        }

        console.log('📋 Поточні кораблі:', shipsData);

        // Перевіряємо, чи вже є такий корабель
        let existingShip = shipsData.ships.find(s =>
            s.projectName === project.name &&
            s.shipLevel === project.shipLevel &&
            s.weaponsCount === project.weaponsCount &&
            s.weaponLevel === project.weaponLevel
        );

        if (existingShip) {
            // Збільшуємо кількість
            existingShip.count += count;
            console.log(`🔄 Оновлено існуючий корабель: ${existingShip.projectName} (+${count} шт.)`);
        } else {
            // Додаємо новий запис
            const newShip = {
                projectName: project.name,
                shipLevel: project.shipLevel,
                weaponsCount: project.weaponsCount,
                weaponLevel: project.weaponLevel,
                count: count,
                builtAt: new Date().toLocaleDateString('uk-UA')
            };
            shipsData.ships.push(newShip);
            console.log(`➕ Додано новий корабель:`, newShip);
        }

        console.log('💾 Зберігаємо дані кораблів:', shipsData);

        // Зберігаємо оновлені дані
        const saveResponse = await fetch('/api/save-ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipsData)
        });

        console.log('📡 Статус відповіді:', saveResponse.status, saveResponse.statusText);

        if (!saveResponse.ok) {
            const errorData = await saveResponse.json();
            console.error('❌ Помилка збереження:', errorData);
            throw new Error(errorData.message || 'Помилка збереження');
        }

        const result = await saveResponse.json();
        console.log('✅ Результат збереження:', result);
        console.log(`🚀 Збудовано кораблів "${project.name}": ${count} шт.`);

        // Оновлюємо відображення у доці (навіть якщо вкладка закрита)
        const shipsList = document.getElementById('tera-ships-list');
        if (shipsList) {
            updateDockDisplay();
        } else {
            console.log('⚠️ shipsList не знайдено (вкладка Док закрита)');
        }

        // Очистити вибір проекту
        const projectSelect = document.getElementById('ship-project-select');
        if (projectSelect) {
            projectSelect.value = '';
        }

        alert(`✅ Збудовано ${count} кораблів "${project.name}"!`);
    } catch (error) {
        console.error('Помилка при збереженні кораблів:', error);
        alert('❌ Помилка при збереженні кораблів: ' + error.message);
    }
}

// Функція для відображення кораблів у вкладці "Док"
async function updateDockDisplay() {
    const shipsList = document.getElementById('tera-ships-list');
    if (!shipsList) {
        console.log('shipsList не знайдено');
        return;
    }

    try {
        // Отримуємо дані з файлу ships.json
        const response = await fetch('/planets/tera/ships.json');
        let shipsData = { ships: [] };

        if (response.ok) {
            shipsData = await response.json();
            console.log('Отримано дані кораблів:', shipsData);
        } else {
            console.log('Не вдалося отримати ships.json, статус:', response.status);
        }

        if (shipsData.ships.length === 0) {
            shipsList.innerHTML = '<p style="color: #aaa; text-align: center; grid-column: 1/-1;">Немає збудованих кораблів</p>';
            return;
        }

        // Відображаємо кораблі (тільки назва і кількість)
        shipsList.innerHTML = shipsData.ships.map((ship, index) => {
            return `
                <div style="
                    background: #134d5c;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    padding: 12px 15px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(31,162,199,0.3)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                onclick="openShipStats(${index})"
                >
                    <div style="font-size: 1.1em; font-weight: bold; color: #1fa2c7;">
                        🚀 ${ship.projectName}
                    </div>
                    <div style="color: #f59e0b; font-weight: bold; font-size: 1.1em;">
                        ${ship.count} шт
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Помилка при отриманні даних кораблів:', error);
        shipsList.innerHTML = '<p style="color: #aaa; text-align: center;">Помилка завантаження даних</p>';
    }
}

// Функція для відкриття характеристик корабля
async function openShipStats(shipIndex) {
    // Отримуємо дані з ships.json
    let shipsData = { ships: [] };
    try {
        const response = await fetch('/planets/tera/ships.json');
        if (response.ok) {
            shipsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні даних кораблів:', e);
        alert('❌ Помилка завантаження даних');
        return;
    }

    const ship = shipsData.ships[shipIndex];
    if (!ship) return;

    const hp = ship.shipLevel * 10;
    const weaponDamage = ship.weaponLevel > 0 ? ship.weaponLevel : 0;
    const totalWeaponDamage = ship.weaponsCount * weaponDamage;
    const totalDamage = totalWeaponDamage * ship.count;

    const statsWindow = document.getElementById('ship-stats-window');
    const statsContent = document.getElementById('ship-stats-content');

    statsContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 20px; color: #1fa2c7; text-align: center;">
                🚀 ${ship.projectName}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7;">
                    <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">❤️ Боєздатність (один)</div>
                    <div style="font-size: 1.8em; color: #ef4444; font-weight: bold;">${hp}</div>
                    <div style="color: #aaa; font-size: 0.75em; margin-top: 5px;">${ship.shipLevel} рівень × 10 HP</div>
                </div>
                <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7;">
                    <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">📦 Кількість</div>
                    <div style="font-size: 1.8em; color: #f59e0b; font-weight: bold;">${ship.count}</div>
                    <div style="color: #aaa; font-size: 0.75em; margin-top: 5px;">збудовано ${ship.builtAt}</div>
                </div>
            </div>

            <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7; margin-bottom: 20px;">
                <div style="color: #aaa; font-size: 0.85em; margin-bottom: 10px;">🔫 Озброєння</div>
                ${ship.weaponsCount > 0 ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div style="background: #0e3a47; padding: 10px; border-radius: 4px;">
                            <div style="color: #aaa; font-size: 0.85em;">Кількість гармат</div>
                            <div style="font-size: 1.5em; color: #3b82f6; font-weight: bold;">${ship.weaponsCount}</div>
                        </div>
                        <div style="background: #0e3a47; padding: 10px; border-radius: 4px;">
                            <div style="color: #aaa; font-size: 0.85em;">Рівень гармат</div>
                            <div style="font-size: 1.5em; color: #8b5cf6; font-weight: bold;">${ship.weaponLevel}</div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; padding: 10px; background: #0e3a47; border-radius: 4px; text-align: center;">
                        <div style="color: #aaa; font-size: 0.85em;">⚔️ Урон однієї гармати</div>
                        <div style="font-size: 1.3em; color: #ef4444; font-weight: bold;">${weaponDamage}</div>
                    </div>
                ` : '<div style="color: #aaa; text-align: center; padding: 10px;">Немає озброєння</div>'}
            </div>

            <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7; margin-bottom: 20px;">
                <div style="color: #aaa; font-size: 0.85em; margin-bottom: 10px;">💥 Загальний урон залпу</div>
                <div style="font-size: 2em; color: #ef4444; font-weight: bold; text-align: center;">${totalDamage}</div>
                <div style="color: #aaa; font-size: 0.75em; text-align: center; margin-top: 5px;">
                    ${ship.weaponsCount} гармат × ${weaponDamage} урон × ${ship.count} кораблів
                </div>
            </div>

            <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7;">
                <div style="color: #aaa; font-size: 0.85em; margin-bottom: 10px;">📊 Загальна боєздатність ескадри</div>
                <div style="font-size: 1.8em; color: #4ade80; font-weight: bold; text-align: center;">${hp * ship.count}</div>
                <div style="color: #aaa; font-size: 0.75em; text-align: center; margin-top: 5px;">
                    ${hp} HP × ${ship.count} кораблів
                </div>
            </div>
            
            <button onclick="deleteShipFromStats(${shipIndex})" style="
                margin-top: 20px;
                padding: 12px 20px;
                background: #dc2626;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
                width: 100%;
            ">🔓 Розібрати</button>
        </div>
    `;

    statsWindow.style.display = 'block';
    if (typeof bringWindowToFront === 'function') {
        bringWindowToFront(statsWindow);
    }

    makeDraggable(statsWindow);
}

// Функція для видалення корабля
async function deleteShip(index) {
    if (!confirm('Видалити цей корабель?')) return;

    try {
        const response = await fetch('/planets/tera/ships.json');
        let shipsData = { ships: [] };

        if (response.ok) {
            shipsData = await response.json();
        }

        shipsData.ships.splice(index, 1);

        await fetch('/api/save-ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipsData)
        });

        updateDockDisplay();
    } catch (error) {
        console.error('Помилка при видаленні корабля:', error);
    }
}

// Функція для видалення корабля з вікна характеристик
async function deleteShipFromStats(index) {
    if (!confirm('Розібрати цей корабель на запчастини?')) return;

    try {
        const response = await fetch('/planets/tera/ships.json');
        let shipsData = { ships: [] };

        if (response.ok) {
            shipsData = await response.json();
        }

        shipsData.ships.splice(index, 1);

        await fetch('/api/save-ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipsData)
        });

        // Закрити вікно характеристик
        closeShipStatsWindow();
        
        // Оновити відображення
        updateDockDisplay();
    } catch (error) {
        console.error('Помилка при розбиранні корабля:', error);
    }
}

// Функція для закриття вікна характеристик корабля
function closeShipStatsWindow() {
    const statsWindow = document.getElementById('ship-stats-window');
    if (statsWindow) {
        statsWindow.style.display = 'none';
    }
}

// Експортуємо функції в глобальну область
window.loadShipProjects = loadShipProjects;
window.buildShip = buildShip;
window.updateDockDisplay = updateDockDisplay;
window.openShipStats = openShipStats;
window.deleteShip = deleteShip;
window.deleteShipFromStats = deleteShipFromStats;
window.closeShipStatsWindow = closeShipStatsWindow;
