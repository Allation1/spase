// Функція для відкриття вікна створення флоту
async function openCreateFleetWindow() {
    const createFleetWindow = document.getElementById('create-fleet-window');
    const createFleetContent = document.getElementById('create-fleet-content');
    
    // Завантажуємо кораблі з доку
    let shipsData = { ships: [] };
    try {
        const response = await fetch('/planets/tera/ships.json');
        if (response.ok) {
            shipsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні кораблів:', e);
    }
    
    // Зберігаємо кораблі у глобальній змінній для використання при збереженні
    window.availableShips = shipsData.ships;
    
    // Формуємо HTML для вибору кораблів
    let shipsHTML = '';
    if (shipsData.ships.length === 0) {
        shipsHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">Немає доступних кораблів у доці</p>';
    } else {
        shipsHTML = shipsData.ships.map((ship, index) => `
            <div style="
                background: #134d5c;
                border: 1px solid #1fa2c7;
                border-radius: 4px;
                padding: 12px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #1fa2c7; margin-bottom: 5px;">🚀 ${ship.projectName}</div>
                    <div style="color: #aaa; font-size: 0.85em;">
                        Доступно: <span style="color: #4ade80; font-weight: bold;">${ship.count}</span> шт
                    </div>
                    <div style="color: #aaa; font-size: 0.75em; margin-top: 3px;">
                        Рівень: ${ship.shipLevel} | Гармати: ${ship.weaponsCount} (рівень ${ship.weaponLevel})
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <label style="color: #aaa; font-size: 0.85em;">У флот:</label>
                    <input type="number" 
                        id="ship-count-${index}" 
                        min="0" 
                        max="${ship.count}" 
                        value="0"
                        style="
                            width: 60px;
                            padding: 5px;
                            background: #0e3a47;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            text-align: center;
                        "
                        onchange="validateShipCount(this, ${ship.count})"
                    >
                </div>
            </div>
        `).join('');
    }
    
    createFleetContent.innerHTML = `
        <div style="padding: 15px;">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1fa2c7;">🚀 Назва флоту:</label>
                <input type="text" 
                    id="fleet-name-input" 
                    placeholder="Введіть назву флоту"
                    style="
                        width: 100%;
                        padding: 10px;
                        background: #134d5c;
                        color: white;
                        border: 1px solid #1fa2c7;
                        border-radius: 4px;
                        font-size: 1em;
                    "
                >
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold; color: #1fa2c7;">📦 Обрати кораблі:</label>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${shipsHTML}
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="saveFleet()" style="
                    flex: 1;
                    padding: 12px;
                    background: #1fa2c7;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1em;
                ">💾 Зберегти флот</button>
                <button onclick="closeCreateFleetWindow()" style="
                    flex: 1;
                    padding: 12px;
                    background: #555;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1em;
                ">✕ Скасувати</button>
            </div>
        </div>
    `;
    
    createFleetWindow.style.display = 'block';
    if (typeof bringWindowToFront === 'function') {
        bringWindowToFront(createFleetWindow);
    }
    
    // Додаємо можливість рухати вікно
    let isDragging = false, offsetX = 0, offsetY = 0;
    const titleElement = createFleetWindow.querySelector('.science-window-title');
    
    if (titleElement) {
        titleElement.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - createFleetWindow.offsetLeft;
            offsetY = e.clientY - createFleetWindow.offsetTop;
            document.body.style.userSelect = 'none';
            if (typeof bringWindowToFront === 'function') {
                bringWindowToFront(createFleetWindow);
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                createFleetWindow.style.left = (e.clientX - offsetX) + 'px';
                createFleetWindow.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
}

// Функція для перевірки кількості кораблів
function validateShipCount(input, maxCount) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 0) {
        value = 0;
    }
    if (value > maxCount) {
        value = maxCount;
        alert(`❌ Неможливо додати більше ${maxCount} кораблів!`);
    }
    input.value = value;
}

// Функція для збереження флоту
async function saveFleet() {
    const fleetNameInput = document.getElementById('fleet-name-input');
    const fleetName = fleetNameInput.value.trim();
    
    if (!fleetName) {
        alert('❌ Введіть назву флоту');
        return;
    }
    
    // Збираємо обрані кораблі
    const selectedShips = [];
    let hasShips = false;
    
    if (window.availableShips && window.availableShips.length > 0) {
        window.availableShips.forEach((ship, index) => {
            const countInput = document.getElementById(`ship-count-${index}`);
            if (countInput) {
                const count = parseInt(countInput.value);
                if (count > 0) {
                    selectedShips.push({
                        shipIndex: index,
                        projectName: ship.projectName,
                        shipLevel: ship.shipLevel,
                        weaponsCount: ship.weaponsCount,
                        weaponLevel: ship.weaponLevel,
                        count: count
                    });
                    hasShips = true;
                }
            }
        });
    }
    
    if (!hasShips) {
        alert('❌ Оберіть хоча б один корабель для флоту');
        return;
    }
    
    // Створюємо флот
    const fleet = {
        name: fleetName,
        ships: selectedShips,
        status: 'На базі',
        createdAt: new Date().toLocaleDateString('uk-UA')
    };
    
    // Завантажуємо існуючі флоти
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні флотів:', e);
    }
    
    // Додаємо новий флот
    fleetsData.fleets.push(fleet);
    
    // Віднімаємо кораблі з доку
    let shipsData = { ships: [] };
    try {
        const response = await fetch('/planets/tera/ships.json');
        if (response.ok) {
            shipsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні кораблів:', e);
    }
    
    // Віднімаємо вибрані кораблі
    selectedShips.forEach(selectedShip => {
        const shipInDock = shipsData.ships.find(s => 
            s.projectName === selectedShip.projectName &&
            s.shipLevel === selectedShip.shipLevel &&
            s.weaponsCount === selectedShip.weaponsCount &&
            s.weaponLevel === selectedShip.weaponLevel
        );
        
        if (shipInDock) {
            shipInDock.count -= selectedShip.count;
            // Якщо кількість стала 0 або від'ємна, видаляємо корабель
            if (shipInDock.count <= 0) {
                shipsData.ships = shipsData.ships.filter(s => s !== shipInDock);
            }
        }
    });
    
    // Зберігаємо флоти
    try {
        const saveFleetsResponse = await fetch('/api/save-fleets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fleetsData)
        });
        
        if (!saveFleetsResponse.ok) {
            const errorData = await saveFleetsResponse.json();
            throw new Error(errorData.message || 'Помилка збереження флоту');
        }
        
        // Зберігаємо оновлені кораблі
        const saveShipsResponse = await fetch('/api/save-ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipsData)
        });
        
        if (!saveShipsResponse.ok) {
            const errorData = await saveShipsResponse.json();
            throw new Error(errorData.message || 'Помилка збереження кораблів');
        }
        
        alert(`✅ Флот "${fleetName}" створено! Кораблі переміщено з доку.`);
        closeCreateFleetWindow();
        updateFleetsDisplay();
        updateDockShipsDisplay();
        
        // Оновлюємо відображення флотів на орбіті Тери (якщо вікно відкрите)
        if (typeof displayFleetsOnOrbit === 'function') {
            displayFleetsOnOrbit();
        }
        
        // Також оновлюємо, якщо вікно сонячної системи відкрите
        const solarWindow = document.getElementById('solar-system-window');
        if (solarWindow && solarWindow.style.display === 'block') {
            setTimeout(() => {
                if (typeof displayFleetsOnOrbit === 'function') {
                    displayFleetsOnOrbit();
                }
            }, 200);
        }
    } catch (error) {
        console.error('Помилка при збереженні флоту:', error);
        alert('❌ Помилка при збереженні флоту: ' + error.message);
    }
}

// Функція для закриття вікна створення флоту
function closeCreateFleetWindow() {
    const createFleetWindow = document.getElementById('create-fleet-window');
    if (createFleetWindow) {
        createFleetWindow.style.display = 'none';
    }
}

// Функція для відображення флотів
async function updateFleetsDisplay() {
    const fleetsList = document.getElementById('fleets-list');
    if (!fleetsList) return;
    
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні флотів:', e);
    }
    
    // Фільтруємо тільки свої флоти (не піратські)
    const playerFleets = fleetsData.fleets.filter(fleet => fleet.type !== 'pirate');
    
    if (playerFleets.length === 0) {
        fleetsList.innerHTML = '<p style="color: #aaa; text-align: center; grid-column: 1/-1;">Немає створених флотів</p>';
        return;
    }
    
    fleetsList.innerHTML = playerFleets.map((fleet, index) => {
        const totalShips = fleet.ships.reduce((sum, ship) => sum + ship.count, 0);
        return `
            <div style="
                background: #134d5c;
                border: 1px solid #1fa2c7;
                border-radius: 4px;
                padding: 15px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(31,162,199,0.3)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
            onclick="openFleetDetails(${index})"
            >
                <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #1fa2c7;">
                    🚀 ${fleet.name}
                </div>
                <div style="color: #aaa; font-size: 0.9em; margin-bottom: 5px;">
                    📦 Кораблів: <span style="color: #f59e0b; font-weight: bold;">${totalShips}</span>
                </div>
                <div style="color: #aaa; font-size: 0.9em; margin-bottom: 10px;">
                    📊 Статус: <span style="color: #4ade80;">${fleet.status}</span>
                </div>
                <div style="font-size: 0.75em; color: #666; text-align: right;">
                    📅 Створено: ${fleet.createdAt}
                </div>
                <button onclick="event.stopPropagation(); deleteFleet(${index})" style="
                    margin-top: 10px;
                    padding: 5px 10px;
                    background: #dc2626;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85em;
                    width: 100%;
                ">🗑️ Розформувати</button>
            </div>
        `;
    }).join('');
}

// Функція для відкриття деталей флоту
async function openFleetDetails(fleetIndex) {
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні флотів:', e);
        alert('❌ Помилка завантаження даних');
        return;
    }
    
    const fleet = fleetsData.fleets[fleetIndex];
    if (!fleet) return;

    const totalShips = fleet.ships.reduce((sum, ship) => sum + ship.count, 0);
    const totalHP = fleet.ships.reduce((sum, ship) => sum + (ship.shipLevel * 10 * ship.count), 0);
    const totalDamage = fleet.ships.reduce((sum, ship) => sum + (ship.weaponsCount * ship.weaponLevel * ship.count), 0);
    
    // Зберігаємо поточний обраний флот для переміщення
    window.currentSelectedFleetIndex = fleetIndex;

    let fleetDetailsWindow = document.getElementById('fleet-details-window');
    let fleetDetailsContent = document.getElementById('fleet-details-content');

    if (!fleetDetailsWindow) {
        fleetDetailsWindow = document.createElement('div');
        fleetDetailsWindow.id = 'fleet-details-window';
        fleetDetailsWindow.className = 'fleet-details-window';
        fleetDetailsWindow.innerHTML = `
            <button class="science-close-btn" onclick="closeFleetDetailsWindow()">✕</button>
            <div class="science-window-title">Деталі флоту</div>
            <div class="science-window-content" id="fleet-details-content"></div>
        `;
        document.body.appendChild(fleetDetailsWindow);
        
        // Додаємо стилі
        const style = document.createElement('style');
        style.textContent = `
            .fleet-details-window {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                min-height: 400px;
                max-height: 80vh;
                background: #0e3a47;
                border: 2px solid #1fa2c7;
                border-radius: 4px;
                box-shadow: 2px 4px 16px rgba(0,0,0,0.3);
                z-index: 240;
                color: #fff;
                display: none;
                overflow: hidden;
            }
            .fleet-details-window .science-window-content {
                padding: 15px;
                height: calc(100% - 50px);
                overflow-y: auto;
            }
        `;
        document.head.appendChild(style);
    }
    
    fleetDetailsContent = document.getElementById('fleet-details-content');
    
    let shipsHTML = fleet.ships.map(ship => `
        <div style="
            background: #0e3a47;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <div style="flex: 1;">
                <div style="font-weight: bold; color: #1fa2c7;">🚀 ${ship.projectName}</div>
                <div style="font-size: 0.85em; color: #aaa;">
                    Рівень: ${ship.shipLevel} | Гармати: ${ship.weaponsCount} (рівень ${ship.weaponLevel})
                </div>
            </div>
            <div style="color: #f59e0b; font-weight: bold;">
                ${ship.count} шт
            </div>
        </div>
    `).join('');
    
    fleetDetailsContent.innerHTML = `
        <div style="padding: 15px;">
            <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 20px; color: #1fa2c7; text-align: center;">
                🚀 ${fleet.name}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7; text-align: center;">
                    <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">📦 Кораблів</div>
                    <div style="font-size: 1.8em; color: #f59e0b; font-weight: bold;">${totalShips}</div>
                </div>
                <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7; text-align: center;">
                    <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">❤️ Загальне HP</div>
                    <div style="font-size: 1.8em; color: #ef4444; font-weight: bold;">${totalHP}</div>
                </div>
                <div style="background: #134d5c; padding: 15px; border-radius: 4px; border: 1px solid #1fa2c7; text-align: center;">
                    <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">⚔️ Загальний урон</div>
                    <div style="font-size: 1.8em; color: #4ade80; font-weight: bold;">${totalDamage}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-weight: bold; color: #1fa2c7; margin-bottom: 10px;">📦 Склад флоту:</div>
                ${shipsHTML}
            </div>
            
            <div style="padding: 10px; background: #134d5c; border-radius: 4px; border: 1px solid #1fa2c7; margin-bottom: 20px;">
                <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">📊 Статус: <span style="color: #4ade80;">${fleet.status}</span></div>
                <div style="color: #aaa; font-size: 0.75em; margin-top: 5px;">📅 Створено: ${fleet.createdAt}</div>
                <div style="color: #aaa; font-size: 0.85em; margin-top: 5px;">📍 Координати: <span style="color: #f59e0b;">${fleet.coordinates || 'Немає'}</span></div>
            </div>
            
            <button id="start-battle-btn-${fleetIndex}" onclick="startBattle(${fleetIndex})" style="
                padding: 12px 20px;
                background: #555;
                color: #aaa;
                border: none;
                border-radius: 4px;
                cursor: not-allowed;
                font-weight: bold;
                font-size: 1em;
                width: 100%;
                margin-bottom: 10px;
            " disabled>⚔️ Почати бій</button>
            <div id="battle-status-${fleetIndex}" style="
                padding: 10px;
                background: #0e3a47;
                border-radius: 4px;
                margin-bottom: 10px;
                text-align: center;
                color: #aaa;
                font-size: 0.85em;
            ">
                📡 Пошук противника на орбіті...
            </div>
            
            <div style="padding: 10px; background: #134d5c; border-radius: 4px; border: 1px solid #1fa2c7; margin-bottom: 20px;">
                <div style="color: #aaa; font-size: 0.85em; margin-bottom: 5px;">ℹ️ Інструкція</div>
                <div style="color: #aaa; font-size: 0.75em;">
                    1. Відкрийте вікно сонячної системи (🌌)<br>
                    2. Натисніть "Політ" біля потрібної орбіти<br>
                    3. Флот переміститься на нову орбіту
                </div>
            </div>
            
            <button onclick="deleteFleetFromDetails(${fleetIndex})" style="
                padding: 12px 20px;
                background: #dc2626;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
                width: 100%;
            ">🗑️ Розформувати флот</button>
        </div>
    `;
    
    fleetDetailsWindow.style.display = 'block';
    if (typeof bringWindowToFront === 'function') {
        bringWindowToFront(fleetDetailsWindow);
    }

    // Перевіряємо наявність противників на орбіті
    checkEnemiesOnOrbit(fleetIndex, fleet.coordinates);

    // Додаємо можливість рухати вікно мишкою
    let isDragging = false, offsetX = 0, offsetY = 0;
    const titleElement = fleetDetailsWindow.querySelector('.science-window-title');

    if (titleElement) {
        titleElement.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - fleetDetailsWindow.offsetLeft;
            offsetY = e.clientY - fleetDetailsWindow.offsetTop;
            document.body.style.userSelect = 'none';
            if (typeof bringWindowToFront === 'function') {
                bringWindowToFront(fleetDetailsWindow);
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                fleetDetailsWindow.style.left = (e.clientX - offsetX) + 'px';
                fleetDetailsWindow.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
}

// Функція для закриття вікна деталей флоту
function closeFleetDetailsWindow() {
    const fleetDetailsWindow = document.getElementById('fleet-details-window');
    if (fleetDetailsWindow) {
        fleetDetailsWindow.style.display = 'none';
    }
}

// Функція для видалення флоту
async function deleteFleet(index) {
    if (!confirm('Розформувати цей флот? Кораблі повернуться у док.')) return;
    
    try {
        const response = await fetch('/planets/fleets.json');
        let fleetsData = { fleets: [] };
        
        if (response.ok) {
            fleetsData = await response.json();
        }
        
        // Отримуємо кораблі флоту перед видаленням
        const fleetShips = fleetsData.fleets[index]?.ships || [];
        
        // Завантажуємо кораблі з доку
        let shipsData = { ships: [] };
        try {
            const shipsResponse = await fetch('/planets/tera/ships.json');
            if (shipsResponse.ok) {
                shipsData = await shipsResponse.json();
            }
        } catch (e) {
            console.error('Помилка при отриманні кораблів:', e);
        }
        
        // Повертаємо кораблі у док
        fleetShips.forEach(fleetShip => {
            const existingShip = shipsData.ships.find(s => 
                s.projectName === fleetShip.projectName &&
                s.shipLevel === fleetShip.shipLevel &&
                s.weaponsCount === fleetShip.weaponsCount &&
                s.weaponLevel === fleetShip.weaponLevel
            );
            
            if (existingShip) {
                existingShip.count += fleetShip.count;
            } else {
                shipsData.ships.push({
                    projectName: fleetShip.projectName,
                    shipLevel: fleetShip.shipLevel,
                    weaponsCount: fleetShip.weaponsCount,
                    weaponLevel: fleetShip.weaponLevel,
                    count: fleetShip.count,
                    builtAt: new Date().toLocaleDateString('uk-UA')
                });
            }
        });
        
        // Зберігаємо оновлені кораблі
        await fetch('/api/save-ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipsData)
        });
        
        // Видаляємо флот
        fleetsData.fleets.splice(index, 1);
        
        await fetch('/api/save-fleets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fleetsData)
        });
        
        updateFleetsDisplay();
        updateDockShipsDisplay();
        
        // Оновлюємо відображення флотів на орбіті Тери
        if (typeof displayFleetsOnOrbit === 'function') {
            displayFleetsOnOrbit();
        }
    } catch (error) {
        console.error('Помилка при видаленні флоту:', error);
    }
}

// Функція для видалення флоту з вікна деталей
async function deleteFleetFromDetails(fleetIndex) {
    if (!confirm('Розформувати цей флот? Кораблі повернуться у док.')) return;
    
    try {
        const response = await fetch('/planets/fleets.json');
        let fleetsData = { fleets: [] };
        
        if (response.ok) {
            fleetsData = await response.json();
        }
        
        // Отримуємо кораблі флоту перед видаленням
        const fleetShips = fleetsData.fleets[fleetIndex]?.ships || [];
        
        // Завантажуємо кораблі з доку
        let shipsData = { ships: [] };
        try {
            const shipsResponse = await fetch('/planets/tera/ships.json');
            if (shipsResponse.ok) {
                shipsData = await shipsResponse.json();
            }
        } catch (e) {
            console.error('Помилка при отриманні кораблів:', e);
        }
        
        // Повертаємо кораблі у док
        fleetShips.forEach(fleetShip => {
            const existingShip = shipsData.ships.find(s => 
                s.projectName === fleetShip.projectName &&
                s.shipLevel === fleetShip.shipLevel &&
                s.weaponsCount === fleetShip.weaponsCount &&
                s.weaponLevel === fleetShip.weaponLevel
            );
            
            if (existingShip) {
                existingShip.count += fleetShip.count;
            } else {
                shipsData.ships.push({
                    projectName: fleetShip.projectName,
                    shipLevel: fleetShip.shipLevel,
                    weaponsCount: fleetShip.weaponsCount,
                    weaponLevel: fleetShip.weaponLevel,
                    count: fleetShip.count,
                    builtAt: new Date().toLocaleDateString('uk-UA')
                });
            }
        });
        
        // Зберігаємо оновлені кораблі
        await fetch('/api/save-ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipsData)
        });
        
        // Видаляємо флот
        fleetsData.fleets.splice(fleetIndex, 1);
        
        await fetch('/api/save-fleets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fleetsData)
        });
        
        closeFleetDetailsWindow();
        updateFleetsDisplay();
        updateDockShipsDisplay();
        
        // Оновлюємо відображення флотів на орбіті Тери
        if (typeof displayFleetsOnOrbit === 'function') {
            displayFleetsOnOrbit();
        }
    } catch (error) {
        console.error('Помилка при видаленні флоту:', error);
    }
}

// Функція для відображення кораблів у доці у вікні флотів
async function updateDockShipsDisplay() {
    const dockShipsList = document.getElementById('dock-ships-list');
    if (!dockShipsList) return;
    
    let shipsData = { ships: [] };
    try {
        const response = await fetch('/planets/tera/ships.json');
        if (response.ok) {
            shipsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні кораблів:', e);
    }
    
    if (shipsData.ships.length === 0) {
        dockShipsList.innerHTML = '<p style="color: #aaa;">Немає кораблів у доці</p>';
        return;
    }
    
    dockShipsList.innerHTML = shipsData.ships.map(ship => `
        <div style="padding: 5px 0; border-bottom: 1px solid #1fa2c7; display: flex; justify-content: space-between;">
            <span>🚀 ${ship.projectName}</span>
            <span style="color: #f59e0b; font-weight: bold;">${ship.count} шт</span>
        </div>
    `).join('');
}

// Функція для початку бою
async function startBattle(fleetIndex) {
    // Завантажуємо флоти
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні флотів:', e);
        alert('Помилка завантаження флотів');
        return;
    }

    const fleet = fleetsData.fleets[fleetIndex];
    if (!fleet) {
        alert('Флот не знайдено');
        return;
    }

    // Шукаємо піратський флот на тій самій орбіті
    const pirateFleet = fleetsData.fleets.find(f => 
        f.type === 'pirate' && f.coordinates === fleet.coordinates
    );

    if (pirateFleet) {
        const pirateIndex = fleetsData.fleets.findIndex(f => f === pirateFleet);

        // Відкриваємо бій з піратами
        window.open('/battle/battle.html?attacker=' + fleetIndex + '&defender=' + pirateIndex, '_blank');
    } else {
        // Якщо немає піратів, шукаємо інший флот
        const otherFleet = fleetsData.fleets.find(f => 
            f.type !== 'pirate' && f !== fleet && f.coordinates === fleet.coordinates
        );

        if (otherFleet) {
            const otherIndex = fleetsData.fleets.findIndex(f => f === otherFleet);
            window.open('/battle/battle.html?attacker=' + fleetIndex + '&defender=' + otherIndex, '_blank');
        } else {
            alert('Немає противників на орбіті ' + (fleet.coordinates || 'невідомо'));
        }
    }
}

// Функція для перевірки противників на орбіті
async function checkEnemiesOnOrbit(fleetIndex, coordinates) {
    const statusElement = document.getElementById(`battle-status-${fleetIndex}`);
    const battleBtn = document.getElementById(`start-battle-btn-${fleetIndex}`);
    
    if (!statusElement || !battleBtn) return;
    
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні флотів:', e);
        statusElement.textContent = '❌ Помилка перевірки';
        return;
    }
    
    const fleet = fleetsData.fleets[fleetIndex];
    if (!fleet) {
        statusElement.textContent = '❌ Флот не знайдено';
        return;
    }
    
    // Шукаємо піратський флот на тій самій орбіті
    const pirateFleet = fleetsData.fleets.find(f => 
        f.type === 'pirate' && f.coordinates === coordinates
    );
    
    if (pirateFleet) {
        statusElement.innerHTML = '⚠️ <span style="color: #ef4444;">Піратський флот на орбіті!</span>';
        statusElement.style.color = '#ef4444';
        battleBtn.disabled = false;
        battleBtn.style.background = '#ef4444';
        battleBtn.style.color = 'white';
        battleBtn.style.cursor = 'pointer';
        return;
    }
    
    // Шукаємо інший флот гравця
    const otherFleet = fleetsData.fleets.find(f => 
        f.type !== 'pirate' && f !== fleet && f.coordinates === coordinates
    );
    
    if (otherFleet) {
        statusElement.innerHTML = '⚠️ <span style="color: #f59e0b;">Флот гравця на орбіті!</span>';
        statusElement.style.color = '#f59e0b';
        battleBtn.disabled = false;
        battleBtn.style.background = '#f59e0b';
        battleBtn.style.color = 'white';
        battleBtn.style.cursor = 'pointer';
        return;
    }
    
    // Немає противників
    statusElement.innerHTML = '✅ <span style="color: #4ade80;">Орбіта чиста</span>';
    statusElement.style.color = '#4ade80';
    battleBtn.disabled = true;
    battleBtn.style.background = '#555';
    battleBtn.style.color = '#aaa';
    battleBtn.style.cursor = 'not-allowed';
}

// Експортуємо функції в глобальну область
window.openCreateFleetWindow = openCreateFleetWindow;
window.closeCreateFleetWindow = closeCreateFleetWindow;
window.saveFleet = saveFleet;
window.updateFleetsDisplay = updateFleetsDisplay;
window.openFleetDetails = openFleetDetails;
window.closeFleetDetailsWindow = closeFleetDetailsWindow;
window.deleteFleet = deleteFleet;
window.deleteFleetFromDetails = deleteFleetFromDetails;
window.updateDockShipsDisplay = updateDockShipsDisplay;
window.validateShipCount = validateShipCount;
window.startBattle = startBattle;
window.checkEnemiesOnOrbit = checkEnemiesOnOrbit;
