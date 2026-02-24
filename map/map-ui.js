let mapScale = 1;
const GRID_SIZE = 5; // Розмір сітки 5x5

function renderSpaceMap() {
    const mapContainer = document.getElementById('space-map');
    if (!mapContainer) return;
    mapContainer.innerHTML = '';
    mapContainer.style.transform = `scale(${mapScale})`;
    mapContainer.style.transformOrigin = '0 0';

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'space-cell';

            // Додаємо координати у кутку
            const label = document.createElement('div');
            label.className = 'space-cell-label';
            label.textContent = `${x}:${y}`;
            cell.appendChild(label);

            // Сонячна система 1: Жовте сонце (центр)
            if (x === 2 && y === 2) {
                const sun = document.createElement('div');
                sun.className = 'sun';
                sun.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openSolarSystemWindow();
                });
                cell.appendChild(sun);
            }

            // Сонячна система 2: Блакитне сонце (ліворуч знизу)
            if (x === 0 && y === 4) {
                const blueSun = document.createElement('div');
                blueSun.className = 'blue-sun';
                blueSun.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openBlueSolarSystemWindow();
                });
                cell.appendChild(blueSun);
            }

            // Сонячна система 3: Червоне сонце (праворуч зверху)
            if (x === 4 && y === 0) {
                const redSun = document.createElement('div');
                redSun.className = 'red-sun';
                redSun.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openRedSolarSystemWindow();
                });
                cell.appendChild(redSun);
            }

            // Сонячна система 4: Зелене сонце (ліворуч зверху)
            if (x === 0 && y === 0) {
                const greenSun = document.createElement('div');
                greenSun.className = 'green-sun';
                greenSun.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openGreenSolarSystemWindow();
                });
                cell.appendChild(greenSun);
            }

            mapContainer.appendChild(cell);
        }
    }
}


// Змінні для перетягування
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0;
let offsetY = 0;

// Функція для відкриття вікна сонячної системи
function openSolarSystemWindow() {
    // Створюємо вікно сонячної системи, якщо воно ще не існує
    let solarSystemWindow = document.getElementById('solar-system-window');
    
    if (!solarSystemWindow) {
        solarSystemWindow = document.createElement('div');
        solarSystemWindow.id = 'solar-system-window';
        solarSystemWindow.className = 'solar-system-window';
        solarSystemWindow.innerHTML = `
            <div class="solar-system-title">
                <span>Сонячна система</span>
                <span class="coordinates-display">(2:2)</span>
                <button class="solar-system-close-btn" onclick="closeSolarSystemWindow()">✕</button>
            </div>
            <div class="solar-system-content">
                <div class="solar-center">
                    <img src="images/002.png" alt="Сонце" class="solar-star-img">
                </div>
                <div class="solar-system-objects">
                    <div class="planet-item" id="planet-item-2_2_1">
                        <span onclick="openPlanetWindow('Тера')">1 Тера (2:2:1)</span>
                        <button class="flight-btn" onclick="initiateFlight('2:2:1')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-2_2_1"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-2_2_2">
                        <span>2 Астероїдне поле (2:2:2)</span>
                        <button class="flight-btn" onclick="initiateFlight('2:2:2')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-2_2_2"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-2_2_3">
                        <span>3 Астероїдне поле (2:2:3)</span>
                        <button class="flight-btn" onclick="initiateFlight('2:2:3')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-2_2_3"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-2_2_4">
                        <span>4 Астероїдне поле (2:2:4)</span>
                        <button class="flight-btn" onclick="initiateFlight('2:2:4')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-2_2_4"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-2_2_5">
                        <span>5 Астероїдне поле (2:2:5)</span>
                        <button class="flight-btn" onclick="initiateFlight('2:2:5')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-2_2_5"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(solarSystemWindow);
        
        // Додаємо обробник для закриття вікна при кліку поза ним
        solarSystemWindow.addEventListener('click', function(e) {
            if (e.target === solarSystemWindow) {
                solarSystemWindow.style.display = 'none';
            }
        });
        
        // Запобігаємо закриттю вікна при перетягуванні
        solarSystemWindow.addEventListener('mousedown', function(e) {
            if (e.target !== solarSystemWindow) {
                // Якщо клікнули не безпосередньо на фон вікна, не дозволяємо закриття
                e.stopPropagation();
            }
        });
        
        // Додаємо можливість перетягування вікна
        const titleBar = solarSystemWindow.querySelector('.solar-system-title');
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            
            // Отримуємо поточну візуальну позицію вікна (з урахуванням transform)
            const rect = solarSystemWindow.getBoundingClientRect();
            
            // Зберігаємо відступ курсора від лівого верхнього кута вікна
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Встановлюємо left/top у поточну візуальну позицію перед прибиранням transform
            solarSystemWindow.style.left = rect.left + 'px';
            solarSystemWindow.style.top = rect.top + 'px';
            
            // Прибираємо transform щоб уникнути зміщень при подальшому перетягуванні
            solarSystemWindow.style.transform = 'none';
            
            document.body.style.userSelect = 'none';
            // Піднімаємо вікно на передній план при кліку
            bringWindowToFront(solarSystemWindow);
            e.preventDefault(); // Запобігаємо виділенню тексту
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                // Розраховуємо нові координати вікна
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;

                solarSystemWindow.style.left = newLeft + 'px';
                solarSystemWindow.style.top = newTop + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
    
    // Показуємо вікно
    solarSystemWindow.style.display = 'block';
    bringWindowToFront(solarSystemWindow);
    solarSystemWindow.style.position = 'fixed';
    solarSystemWindow.style.top = '50%';
    solarSystemWindow.style.left = '50%';
    solarSystemWindow.style.transform = 'translate(-50%, -50%)';
    solarSystemWindow.style.width = '400px';
    solarSystemWindow.style.height = '400px';
    solarSystemWindow.style.background = '#0e3a47';
    solarSystemWindow.style.border = '2px solid #1fa2c7';
    solarSystemWindow.style.borderRadius = '4px';
    solarSystemWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
    solarSystemWindow.style.zIndex = '300';
    solarSystemWindow.style.color = '#fff';
    solarSystemWindow.style.overflow = 'hidden';
    
    // Відображаємо флоти на орбіті Тери
    setTimeout(() => {
        displayFleetsOnOrbit();
    }, 100);
}

// Функція для відображення флотів на орбітах
async function displayFleetsOnOrbit() {
    console.log('displayFleetsOnOrbit: виклик функції');
    
    // Завантажуємо флоти
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
            console.log('displayFleetsOnOrbit: отримано флоти:', fleetsData);
        }
    } catch (e) {
        console.error('displayFleetsOnOrbit: помилка:', e);
    }
    
    // Очищаємо всі контейнери для флотів
    document.querySelectorAll('.fleet-orbit-icons').forEach(container => {
        container.innerHTML = '';
    });
    
    // Відображаємо кожен флот на відповідній орбіті
    fleetsData.fleets.forEach((fleet, index) => {
        if (!fleet.coordinates) return;
        
        console.log('displayFleetsOnOrbit: додаємо флот', fleet.name, 'на орбіту', fleet.coordinates);
        
        // Знаходимо контейнер для цієї орбіти
        const orbitId = fleet.coordinates.replace(/:/g, '_');
        const orbitContainer = document.getElementById(`fleet-orbit-${orbitId}`);
        
        if (!orbitContainer) {
            console.log('displayFleetsOnOrbit: контейнер для орбіти', fleet.coordinates, 'не знайдено');
            return;
        }
        
        // Перевіряємо, чи це піратський флот
        const isPirate = fleet.type === 'pirate';
        
        // Створюємо іконку флоту
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            cursor: ${isPirate ? 'default' : 'pointer'};
            transition: transform 0.2s;
            display: inline-block;
            margin: 2px;
        `;
        
        if (!isPirate) {
            // Для наших флотів — клік відкриває деталі
            iconContainer.onclick = function(e) {
                e.stopPropagation();
                openFleetDetailsFromMap(index);
            };
        }
        
        // Для всіх флотів — підказка при наведенні
        iconContainer.onmouseover = function() {
            this.style.transform = 'scale(1.2)';
            showFleetTooltip(fleet, this);
        };
        iconContainer.onmouseout = function() {
            this.style.transform = 'scale(1)';
            hideFleetTooltip();
        };
        
        // SVG іконка флоту (червона для наших, чорна для піратів)
        const iconColor = isPirate ? '#000000' : '#ff0000';
        const iconShadow = isPirate ? 'drop-shadow(0 0 3px #000000)' : 'drop-shadow(0 0 3px #ff0000)';
        
        iconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" style="
                filter: ${iconShadow};
                display: block;
            ">
                <path d="M12 2 Q14 8 16 14 Q20 16 18 18 Q14 16 12 22 Q10 16 6 18 Q4 16 8 14 Q10 8 12 2 Z" 
                      fill="${iconColor}" 
                      stroke="#ffffff" 
                      stroke-width="0.5"/>
            </svg>
        `;
        
        orbitContainer.appendChild(iconContainer);
    });
    
    console.log('displayFleetsOnOrbit: завершено');
}

// Функція для показу підказки флоту
function showFleetTooltip(fleet, element) {
    // Створюємо або знаходимо підказку
    let tooltip = document.getElementById('fleet-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'fleet-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #0e3a47;
            border: 2px solid #1fa2c7;
            border-radius: 4px;
            padding: 10px;
            color: white;
            font-size: 0.85em;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(tooltip);
    }
    
    // Перевіряємо, чи це піратський флот
    const isPirate = fleet.type === 'pirate';
    
    // Формуємо вміст підказки
    const totalShips = fleet.ships.reduce((sum, ship) => sum + ship.count, 0);
    
    if (isPirate) {
        // Для піратів показуємо тільки загальну кількість
        tooltip.innerHTML = `
            <div style="font-weight: bold; color: #666; margin-bottom: 5px;">☠️ ${fleet.name}</div>
            <div style="color: #aaa; font-size: 0.9em;">📦 Кораблів: <span style="color: #f59e0b;">${totalShips}</span></div>
            <div style="color: #666; font-size: 0.75em; margin-top: 5px;">⚠️ Ворожий флот</div>
        `;
    } else {
        // Для наших флотів показуємо повну інформацію
        const totalHP = fleet.ships.reduce((sum, ship) => sum + (ship.shipLevel * 10 * ship.count), 0);
        const totalDamage = fleet.ships.reduce((sum, ship) => sum + (ship.weaponsCount * ship.weaponLevel * ship.count), 0);
        
        tooltip.innerHTML = `
            <div style="font-weight: bold; color: #1fa2c7; margin-bottom: 5px;">🚀 ${fleet.name}</div>
            <div style="color: #aaa; font-size: 0.9em;">📦 Кораблів: <span style="color: #f59e0b;">${totalShips}</span></div>
            <div style="color: #aaa; font-size: 0.9em;">❤️ HP: <span style="color: #ef4444;">${totalHP}</span></div>
            <div style="color: #aaa; font-size: 0.9em;">⚔️ Урон: <span style="color: #4ade80;">${totalDamage}</span></div>
            <div style="color: #666; font-size: 0.75em; margin-top: 5px;">📅 ${fleet.createdAt}</div>
        `;
    }
    
    // Позиціонуємо підказку біля іконки
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + 'px';
    tooltip.style.top = rect.top + 'px';
    tooltip.style.display = 'block';
}

// Функція для приховання підказки
function hideFleetTooltip() {
    const tooltip = document.getElementById('fleet-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Функція для відкриття деталей флоту з карти
async function openFleetDetailsFromMap(fleetIndex) {
    // Відкриваємо тільки вікно деталей флоту, не вікно флотів
    if (typeof openFleetDetails === 'function') {
        openFleetDetails(fleetIndex);
    }
}

// Функція для відкриття вікна планети
function openPlanetWindow(planetName) {
    if (planetName === 'Тера') {
        // Викликаємо функцію відкриття вікна Тери, якщо вона доступна
        if (typeof openTeraWindow === 'function') {
            openTeraWindow();
        } else {
            // Якщо функція не визначена, намагаємося викликати її через глобальний об'єкт window
            if (window.openTeraWindow && typeof window.openTeraWindow === 'function') {
                window.openTeraWindow();
            } else {
                // Якщо немає функції, намагаємося знайти і відкрити вікно Тери
                const teraWindow = document.getElementById('tera-window');
                if (teraWindow) {
                    teraWindow.style.display = 'block';
                    
                    // Закриваємо вікно сонячної системи
                    const solarSystemWindow = document.getElementById('solar-system-window');
                    if (solarSystemWindow) {
                        solarSystemWindow.style.display = 'none';
                    }
                } else {
                    // Якщо немає конкретного вікна Тери, намагаємося викликати функцію відкриття вікна Тери напряму
                    if (typeof renderTeraWindow === 'function') {
                        renderTeraWindow();
                        
                        // Закриваємо вікно сонячної системи
                        const solarSystemWindow = document.getElementById('solar-system-window');
                        if (solarSystemWindow) {
                            solarSystemWindow.style.display = 'none';
                        }
                    } else if (window.renderTeraWindow && typeof window.renderTeraWindow === 'function') {
                        window.renderTeraWindow();
                        
                        // Закриваємо вікно сонячної системи
                        const solarSystemWindow = document.getElementById('solar-system-window');
                        if (solarSystemWindow) {
                            solarSystemWindow.style.display = 'none';
                        }
                    } else {
                        // Якщо жодна з функцій не доступна, відкриваємо вікно списку планет
                        const planetWindow = document.getElementById('planet-window');
                        if (planetWindow) {
                            planetWindow.style.display = 'block';
                            
                            // Закриваємо вікно сонячної системи
                            const solarSystemWindow = document.getElementById('solar-system-window');
                            if (solarSystemWindow) {
                                solarSystemWindow.style.display = 'none';
                            }
                            
                            // Після відкриття вікна планет, шукаємо і клікаємо на планету Тера у списку
                            setTimeout(() => {
                                const teraPlanetElement = Array.from(document.querySelectorAll('.planet-item, .planet-name, .planet-list div'))
                                    .find(el => el.textContent && (el.textContent.includes('Тера') || el.textContent.includes('tera') || el.textContent.toLowerCase().includes('tera')));
                                
                                if (teraPlanetElement) {
                                    teraPlanetElement.click();
                                } else {
                                    // Якщо не знайшли планету Тера за назвою, спробуємо знайти перший елемент списку планет
                                    const firstPlanetElement = document.querySelector('.planet-item, .planet-name, .planet-list div');
                                    if (firstPlanetElement) {
                                        firstPlanetElement.click();
                                    }
                                }
                            }, 100); // Затримка для того, щоб вікно планети встигло відкритись
                        }
                    }
                }
            }
        }
    }
}

// Функція для відкриття вікна флоту
function showFleetWindow() {
    // Викликаємо функцію відкриття вікна флоту
    const fleetWindow = document.getElementById('fleet-window');
    if (fleetWindow) {
        fleetWindow.style.display = 'block';
        
        // Закриваємо вікно сонячної системи
        const solarSystemWindow = document.getElementById('solar-system-window');
        if (solarSystemWindow) {
            solarSystemWindow.style.display = 'none';
        }
    }
}

// Функція для ініціювання польоту флоту
async function initiateFlight(destination) {
    // Перевіряємо, чи вікно деталей флоту відкрите і обрано флот
    const fleetDetailsWindow = document.getElementById('fleet-details-window');
    const fleetIndex = window.currentSelectedFleetIndex;
    
    if (!fleetDetailsWindow || fleetDetailsWindow.style.display === 'none') {
        alert('Щоб виконати політ, спочатку відкрийте деталі флоту (клікніть на іконку флоту)');
        return;
    }
    
    if (typeof fleetIndex === 'undefined' || fleetIndex === null) {
        alert('Спочатку оберіть флот для відправлення');
        return;
    }
    
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
    
    // Перевіряємо, чи є флоти на орбіті призначення
    const fleetsOnOrbit = fleetsData.fleets.filter(f => 
        f.coordinates === destination && f.type !== 'pirate'
    );
    
    const pirateFleetsOnOrbit = fleetsData.fleets.filter(f => 
        f.coordinates === destination && f.type === 'pirate'
    );
    
    // Якщо на орбіті є пірати — автоматичний бій
    if (pirateFleetsOnOrbit.length > 0) {
        const pirate = pirateFleetsOnOrbit[0];
        if (!confirm(`⚠️ На орбіті ${destination} виявлено піратський флот "${pirate.name}"! Почати бій?`)) {
            return;
        }
        
        // Знаходимо індекс піратського флоту
        const pirateIndex = fleetsData.fleets.findIndex(f => f === pirate);
        
        // Відкриваємо бій
        window.open('/battle/battle.html?attacker=' + fleetIndex + '&defender=' + pirateIndex, '_blank');
        return;
    }
    
    // Якщо на орбіті є інші гравці
    if (fleetsOnOrbit.length > 0) {
        const otherFleet = fleetsOnOrbit[0];
        if (!confirm(`⚠️ На орбіті ${destination} виявлено флот "${otherFleet.name}"! Почати бій?`)) {
            return;
        }
        
        // Знаходимо індекс іншого флоту
        const otherIndex = fleetsData.fleets.findIndex(f => f === otherFleet);
        
        // Відкриваємо бій
        window.open('/battle/battle.html?attacker=' + fleetIndex + '&defender=' + otherIndex, '_blank');
        return;
    }
    
    // Отримуємо поточні координати
    const fromOrbit = fleet.coordinates || 'Невідомо';
    
    // Підтвердження польоту (якщо немає бою)
    if (!confirm(`Перемістити флот "${fleet.name}" з ${fromOrbit} на ${destination}?`)) {
        return;
    }
    
    // Оновлюємо координати флоту
    fleet.coordinates = destination;
    fleet.status = 'На орбіті';
    
    // Зберігаємо оновлені дані
    try {
        await fetch('/api/save-fleets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fleetsData)
        });
        
        alert(`✅ Флот "${fleet.name}" переміщено на ${destination}`);
        
        // Оновлюємо відображення флотів
        displayFleetsOnOrbit();
        
        // Оновлюємо вікно деталей флоту
        if (typeof openFleetDetails === 'function') {
            setTimeout(() => openFleetDetails(fleetIndex), 100);
        }
    } catch (error) {
        console.error('Помилка при збереженні флоту:', error);
        alert('Помилка при збереженні флоту');
    }
}

// Функція для анімації переміщення флоту
function animateFleetMovement(destination) {
    // Ця функція імітує переміщення флоту зі швидкістю 10с за координатний квадрат
    // У реальному застосунку тут буде логіка переміщення іконки флоту
    
    console.log(`Анімація польоту до: ${destination}`);
    
    // Для тесту - просто виводимо повідомлення про переміщення
    // У реальному застосунку тут буде логіка переміщення іконки флоту
    
    // Спробуємо перемістити іконку флоту на карті
    moveFleetIcon(destination);
}

// Функція для переміщення іконки флоту на карті
function moveFleetIcon(destination) {
    // Отримуємо контейнер карти
    const mapContainer = document.getElementById('space-map');
    if (!mapContainer) return;
    
    // Створюємо або отримуємо іконку флоту
    let fleetIcon = document.getElementById('fleet-icon-on-map');
    if (!fleetIcon) {
        fleetIcon = document.createElement('div');
        fleetIcon.id = 'fleet-icon-on-map';
        fleetIcon.className = 'fleet-icon-on-map';
        fleetIcon.textContent = '✈️';
        fleetIcon.style.position = 'absolute';
        fleetIcon.style.fontSize = '24px';
        fleetIcon.style.zIndex = '10';
        fleetIcon.style.pointerEvents = 'none'; // Щоб не перешкоджало іншим клікам

        // Визначаємо початкову позицію флоту залежно від поточної орбіти
        let startPos = null;
        
        if (currentFleetOrbit) {
            // Якщо флот вже десь був, розміщуємо його звідти
            const coordPattern = /^(\d):(\d):(\d)$/;
            const match = currentFleetOrbit.match(coordPattern);
            
            if (match) {
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                const orbit = parseInt(match[3]);

                // Знаходимо клітинку за координатами (для сітки 5x5)
                const cellIndex = y * GRID_SIZE + x;
                const allCells = Array.from(mapContainer.querySelectorAll('.space-cell'));
                const startCell = allCells[cellIndex];
                
                if (startCell) {
                    const rect = startCell.getBoundingClientRect();
                    const mapRect = mapContainer.getBoundingClientRect();
                    
                    // Визначаємо позицію в межах клітинки залежно від номера орбіти
                    let offsetX = 0, offsetY = 0;
                    
                    switch(orbit) {
                        case 1: // Верхній лівий кут клітинки
                            offsetX = rect.width * 0.2;
                            offsetY = rect.height * 0.2;
                            break;
                        case 2: // Верхній правий кут клітинки
                            offsetX = rect.width * 0.8;
                            offsetY = rect.height * 0.2;
                            break;
                        case 3: // Нижній лівий кут клітинки
                            offsetX = rect.width * 0.2;
                            offsetY = rect.height * 0.8;
                            break;
                        case 4: // Нижній правий кут клітинки
                            offsetX = rect.width * 0.8;
                            offsetY = rect.height * 0.8;
                            break;
                        case 5: // Центр клітинки
                        default:
                            offsetX = rect.width * 0.5;
                            offsetY = rect.height * 0.5;
                            break;
                    }
                    
                    fleetIcon.style.left = (rect.left - mapRect.left + offsetX - 12) + 'px';
                    fleetIcon.style.top = (rect.top - mapRect.top + offsetY - 12) + 'px';
                }
            }
        } else {
            // Якщо це перший запуск, розміщуємо флот у центрі першої клітинки (0,0)
            const firstCell = mapContainer.querySelector('.space-cell');
            if (firstCell) {
                const rect = firstCell.getBoundingClientRect();
                const mapRect = mapContainer.getBoundingClientRect();

                fleetIcon.style.left = (rect.left - mapRect.left + rect.width/2 - 12) + 'px';
                fleetIcon.style.top = (rect.top - mapRect.top + rect.height/2 - 12) + 'px';
            }
        }

        mapContainer.appendChild(fleetIcon);
    }
    
    // Визначаємо координати призначення
    let targetCell = null;
    
    // Перевіряємо, чи координати в форматі X:Y:O (X:Y:Орбіта)
    console.log('Destination:', destination);
    const coordPattern = /^(\d):(\d):(\d)$/;
    const match = destination.match(coordPattern);
    console.log('Match result:', match);
    
    if (match) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        const orbit = parseInt(match[3]); // Номер орбіти
        
        console.log(`Parsed coordinates: x=${x}, y=${y}, orbit=${orbit}`);
        
        // Знаходимо клітинку за координатами
        // Для сітки 5x5: індекс = y * 5 + x
        const cellIndex = y * GRID_SIZE + x;
        console.log(`Calculated cell index: ${cellIndex}`);
        
        const allCells = Array.from(mapContainer.querySelectorAll('.space-cell'));
        console.log(`Total cells found: ${allCells.length}`);
        
        targetCell = allCells[cellIndex];
        console.log(`Target cell found: ${!!targetCell}`);
        
        // Якщо знайшли клітинку, переміщуємо флот до неї
        // У майбутньому тут можна додати логіку для розташування флоту на певній орбіті в межах клітинки
        // Поки що просто переміщуємо до центру клітинки
    } else {
        console.log('Coordinate pattern did not match');
    }
    
    // Якщо знайшли цільову клітинку, анімуємо переміщення
    if (targetCell) {
        // Визначаємо номер орбіти з призначення
        const coordPattern = /^(\d):(\d):(\d)$/;
        const match = destination.match(coordPattern);
        let orbit = 5; // За замовчуванням - центр клітинки
        
        if (match) {
            orbit = parseInt(match[3]);
        }
        
        const targetRect = targetCell.getBoundingClientRect();
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Визначаємо позицію в межах клітинки залежно від номера орбіти
        // Розподіляємо орбіти по різних позиціях в межах клітинки
        let offsetX = 0, offsetY = 0;
        
        switch(orbit) {
            case 1: // Верхній лівий кут клітинки
                offsetX = targetRect.width * 0.2;
                offsetY = targetRect.height * 0.2;
                break;
            case 2: // Верхній правий кут клітинки
                offsetX = targetRect.width * 0.8;
                offsetY = targetRect.height * 0.2;
                break;
            case 3: // Нижній лівий кут клітинки
                offsetX = targetRect.width * 0.2;
                offsetY = targetRect.height * 0.8;
                break;
            case 4: // Нижній правий кут клітинки
                offsetX = targetRect.width * 0.8;
                offsetY = targetRect.height * 0.8;
                break;
            case 5: // Центр клітинки
            default:
                offsetX = targetRect.width * 0.5;
                offsetY = targetRect.height * 0.5;
                break;
        }
        
        const targetX = targetRect.left - mapRect.left + offsetX - 12;
        const targetY = targetRect.top - mapRect.top + offsetY - 12;
        
        console.log('Animating position change to:', targetX, targetY);
        // Анімуємо переміщення
        animatePositionChange(fleetIcon, parseFloat(fleetIcon.style.left), parseFloat(fleetIcon.style.top), targetX, targetY);
    }
}

// Глобальна змінна для зберігання поточної позиції флоту
let currentFleetOrbit = '1:1:1'; // Початкова позиція флоту - орбіта біля Тери

// Функція для оновлення відображення флоту біля орбіт
function updateFleetOrbitDisplay(fromOrbit, toOrbit) {
    console.log('updateFleetOrbitDisplay called with:', {fromOrbit, toOrbit});

    // Оновлюємо відображення флоту в контейнерах іконок
    // Знайдемо всі контейнери іконок флоту
    const fleetIconContainers = document.querySelectorAll('.fleet-icon-container');
    
    fleetIconContainers.forEach(container => {
        // Отримаємо ID контейнера, щоб визначити, якій орбіті він відповідає
        const containerId = container.id;
        const orbitCoords = containerId.replace('fleet-icon-', '').replace(/_/g, ':'); // Перетворюємо назад до формату X:Y:O
        
        // Якщо це орбіта, з якої вилітає флот, видалимо значок флоту
        if (fromOrbit && orbitCoords === fromOrbit) {
            console.log('Removing fleet icon from orbit:', orbitCoords);
            // Очищуємо контейнер
            container.innerHTML = '';
        }
        
        // Якщо це орбіта, куди прилітає флот, додамо значок флоту
        if (toOrbit && orbitCoords === toOrbit) {
            console.log('Adding fleet icon to orbit:', orbitCoords);
            // Очищуємо контейнер
            container.innerHTML = '';
            
            // Створюємо новий значок флоту
            const fleetIcon = document.createElement('span');
            fleetIcon.className = 'fleet-at-orbit';
            fleetIcon.textContent = '✈️';
            fleetIcon.title = 'Флот на цій орбіті';
            
            // Додаємо іконку до контейнера
            container.appendChild(fleetIcon);
        }
    });
    
    // Тепер позиціонуємо контейнери іконок флоту поруч з відповідними елементами
    positionFleetIcons();
}

// Функція для позиціонування контейнерів іконок флоту поруч з відповідними елементами
function positionFleetIcons() {
    // Для кожної орбіти встановлюємо позицію контейнера іконки флоту поруч з відповідним елементом
    const orbits = ['1_1_1', '1_1_2', '1_1_3', '1_1_4', '1_1_5', '0_2_1', '0_2_2', '0_2_3', '0_2_4', '0_2_5'];
    
    orbits.forEach(orbit => {
        const container = document.getElementById(`fleet-icon-${orbit}`);
        if (!container) return;
        
        // Конвертуємо формат орбіти з _ назад у : для пошуку елемента
        const orbitCoord = orbit.replace(/_/g, ':');
        
        // Шукаємо відповідний елемент за вмістом (по координатам)
        let correspondingElement = null;
        let overlayElement = null;
        
        // Шукаємо серед елементів відкритих вікон сонячних систем
        const solarSystemWindow = document.getElementById('solar-system-window');
        if (solarSystemWindow && solarSystemWindow.style.display !== 'none') {
            correspondingElement = Array.from(solarSystemWindow.querySelectorAll('.planet-item, .asteroid-field'))
                .find(el => el.textContent.includes(orbitCoord));
            
            // Знаходимо оверлей у цьому вікні
            if (correspondingElement) {
                overlayElement = solarSystemWindow.querySelector('.fleet-icons-overlay');
            }
        }
        
        // Якщо не знайшли у сонячній системі, шукаємо у вікні блакитної системи
        if (!correspondingElement) {
            const blueSolarSystemWindow = document.getElementById('blue-solar-system-window');
            if (blueSolarSystemWindow && blueSolarSystemWindow.style.display !== 'none') {
                correspondingElement = Array.from(blueSolarSystemWindow.querySelectorAll('.asteroid-field'))
                    .find(el => el.textContent.includes(orbitCoord));
                
                // Знаходимо оверлей у цьому вікні
                if (correspondingElement) {
                    overlayElement = blueSolarSystemWindow.querySelector('.fleet-icons-overlay');
                }
            }
        }
        
        if (correspondingElement && overlayElement) {
            // Отримуємо позицію відповідного елемента
            const rect = correspondingElement.getBoundingClientRect();
            const overlayRect = overlayElement.getBoundingClientRect();
            
            // Розраховуємо позицію контейнера відносно оверлею
            const leftPos = rect.right - overlayRect.left + 5; // Додаємо невеликий відступ від елемента
            const topPos = rect.top - overlayRect.top + (rect.height / 2) - 12; // Центруємо вертикально
            
            // Встановлюємо позицію контейнера
            container.style.position = 'absolute';
            container.style.left = leftPos + 'px';
            container.style.top = topPos + 'px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
        } else {
            // Якщо не знайшли відповідний елемент або оверлей, приховуємо контейнер
            container.style.display = 'none';
        }
    });
}

// Функція для анімації зміни позиції
function animatePositionChange(element, startX, startY, endX, endY) {
    console.log('Starting animation:', {element, startX, startY, endX, endY});
    const duration = 1000; // 1 секунда на координату (для тесту)
    const startTime = performance.now();

    // Визначаємо відстань (в координатах)
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Розраховуємо тривалість анімації (10с на координатний квадрат)
    // Для тесту використаємо скорочений час
    const animationDuration = Math.max(1000, distance * 100); // 100мс на піксель для тесту

    function updatePosition(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Використовуємо плавну експоненту для анімації
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentX = startX + deltaX * easeProgress;
        const currentY = startY + deltaY * easeProgress;

        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';

        if (progress < 1) {
            requestAnimationFrame(updatePosition);
        } else {
            console.log('Флот досяг місця призначення');
            
            // Оновлюємо відображення флоту біля нової орбіти
            // (це вже робиться в initiateFlight після завершення анімації)
            // Не потрібно робити це ще раз тут, бо це призведе до дублювання
        }
    }

    requestAnimationFrame(updatePosition);
}

// Функція для закриття вікна сонячної системи
function closeSolarSystemWindow() {
    const solarSystemWindow = document.getElementById('solar-system-window');
    if (solarSystemWindow) {
        solarSystemWindow.style.display = 'none';
    }
}

// Функція для закриття вікна блакитної сонячної системи
function closeBlueSolarSystemWindow() {
    const blueSolarSystemWindow = document.getElementById('blue-solar-system-window');
    if (blueSolarSystemWindow) {
        blueSolarSystemWindow.style.display = 'none';
    }
}

// Функція для відкриття вікна другої сонячної системи з блакитним сонцем
function openBlueSolarSystemWindow() {
    // Створюємо вікно другої сонячної системи, якщо воно ще не існує
    let blueSolarSystemWindow = document.getElementById('blue-solar-system-window');
    
    if (!blueSolarSystemWindow) {
        blueSolarSystemWindow = document.createElement('div');
        blueSolarSystemWindow.id = 'blue-solar-system-window';
        blueSolarSystemWindow.className = 'solar-system-window';
        blueSolarSystemWindow.innerHTML = `
            <div class="solar-system-title">
                <span>Блакитна сонячна система</span>
                <span class="coordinates-display">(0:4)</span>
                <button class="solar-system-close-btn" onclick="closeBlueSolarSystemWindow()">✕</button>
            </div>
            <div class="solar-system-content">
                <div class="solar-center">
                    <img src="images/003.png" alt="Блакитне сонце" class="blue-solar-star-img">
                </div>
                <div class="asteroid-fields-container">
                    <div class="asteroid-field" id="asteroid-field-0_4_1">
                        <span>1 Астероїдне поле (0:4:1)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:4:1')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_4_1"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_4_2">
                        <span>2 Астероїдне поле (0:4:2)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:4:2')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_4_2"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_4_3">
                        <span>3 Астероїдне поле (0:4:3)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:4:3')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_4_3"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_4_4">
                        <span>4 Астероїдне поле (0:4:4)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:4:4')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_4_4"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_4_5">
                        <span>5 Астероїдне поле (0:4:5)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:4:5')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_4_5"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(blueSolarSystemWindow);
        
        // Додаємо обробник для закриття вікна при кліку поза ним
        blueSolarSystemWindow.addEventListener('click', function(e) {
            if (e.target === blueSolarSystemWindow) {
                blueSolarSystemWindow.style.display = 'none';
            }
        });
        
        // Додаємо можливість перетягування вікна
        const titleBar = blueSolarSystemWindow.querySelector('.solar-system-title');
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            
            // Отримуємо поточну візуальну позицію вікна (з урахуванням transform)
            const rect = blueSolarSystemWindow.getBoundingClientRect();
            
            // Зберігаємо відступ курсора від лівого верхнього кута вікна
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Встановлюємо left/top у поточну візуальну позицію перед прибиранням transform
            blueSolarSystemWindow.style.left = rect.left + 'px';
            blueSolarSystemWindow.style.top = rect.top + 'px';
            
            // Прибираємо transform щоб уникнути зміщень при подальшому перетягуванні
            blueSolarSystemWindow.style.transform = 'none';
            
            document.body.style.userSelect = 'none';
            // Піднімаємо вікно на передній план при кліку
            bringWindowToFront(blueSolarSystemWindow);
            e.preventDefault(); // Запобігаємо виділенню тексту
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                // Розраховуємо нові координати вікна
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;

                blueSolarSystemWindow.style.left = newLeft + 'px';
                blueSolarSystemWindow.style.top = newTop + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
    
    // Показуємо вікно
    blueSolarSystemWindow.style.display = 'block';
    blueSolarSystemWindow.style.position = 'fixed';
    blueSolarSystemWindow.style.top = '50%';
    blueSolarSystemWindow.style.left = '50%';
    blueSolarSystemWindow.style.transform = 'translate(-50%, -50%)';
    blueSolarSystemWindow.style.width = '400px';
    blueSolarSystemWindow.style.height = '400px';
    blueSolarSystemWindow.style.background = '#0e3a47';
    blueSolarSystemWindow.style.border = '2px solid #1fa2c7';
    blueSolarSystemWindow.style.borderRadius = '4px';
    blueSolarSystemWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
    blueSolarSystemWindow.style.zIndex = '300';
    blueSolarSystemWindow.style.color = '#fff';
    blueSolarSystemWindow.style.overflow = 'hidden';
    
    // Оновлюємо відображення флотів
    setTimeout(() => {
        displayFleetsOnOrbit();
    }, 100);
}

// Функція для відкриття вікна червоної сонячної системи
function openRedSolarSystemWindow() {
    let redSolarSystemWindow = document.getElementById('red-solar-system-window');

    if (!redSolarSystemWindow) {
        redSolarSystemWindow = document.createElement('div');
        redSolarSystemWindow.id = 'red-solar-system-window';
        redSolarSystemWindow.className = 'solar-system-window';
        redSolarSystemWindow.innerHTML = `
            <div class="solar-system-title">
                <span>Червона сонячна система</span>
                <span class="coordinates-display">(4:0)</span>
                <button class="solar-system-close-btn" onclick="closeRedSolarSystemWindow()">✕</button>
            </div>
            <div class="solar-system-content">
                <div class="solar-center">
                    <img src="images/004.png" alt="Червоне сонце" class="solar-star-img" style="filter: hue-rotate(140deg);">
                </div>
                <div class="solar-system-objects">
                    <div class="planet-item" id="planet-item-4_0_1">
                        <span onclick="openPlanetWindow('Вулкан')">1 Вулкан (4:0:1)</span>
                        <button class="flight-btn" onclick="initiateFlight('4:0:1')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-4_0_1"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-4_0_2">
                        <span>2 Астероїдне поле (4:0:2)</span>
                        <button class="flight-btn" onclick="initiateFlight('4:0:2')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-4_0_2"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-4_0_3">
                        <span>3 Астероїдне поле (4:0:3)</span>
                        <button class="flight-btn" onclick="initiateFlight('4:0:3')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-4_0_3"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-4_0_4">
                        <span>4 Астероїдне поле (4:0:4)</span>
                        <button class="flight-btn" onclick="initiateFlight('4:0:4')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-4_0_4"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-4_0_5">
                        <span>5 Астероїдне поле (4:0:5)</span>
                        <button class="flight-btn" onclick="initiateFlight('4:0:5')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-4_0_5"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(redSolarSystemWindow);

        redSolarSystemWindow.addEventListener('click', function(e) {
            if (e.target === redSolarSystemWindow) {
                redSolarSystemWindow.style.display = 'none';
            }
        });

        const titleBar = redSolarSystemWindow.querySelector('.solar-system-title');
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            const rect = redSolarSystemWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            redSolarSystemWindow.style.left = rect.left + 'px';
            redSolarSystemWindow.style.top = rect.top + 'px';
            redSolarSystemWindow.style.transform = 'none';
            document.body.style.userSelect = 'none';
            bringWindowToFront(redSolarSystemWindow);
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                redSolarSystemWindow.style.left = newLeft + 'px';
                redSolarSystemWindow.style.top = newTop + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    redSolarSystemWindow.style.display = 'block';
    redSolarSystemWindow.style.position = 'fixed';
    redSolarSystemWindow.style.top = '50%';
    redSolarSystemWindow.style.left = '50%';
    redSolarSystemWindow.style.transform = 'translate(-50%, -50%)';
    redSolarSystemWindow.style.width = '400px';
    redSolarSystemWindow.style.height = '400px';
    redSolarSystemWindow.style.background = '#0e3a47';
    redSolarSystemWindow.style.border = '2px solid #1fa2c7';
    redSolarSystemWindow.style.borderRadius = '4px';
    redSolarSystemWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
    redSolarSystemWindow.style.zIndex = '300';
    redSolarSystemWindow.style.color = '#fff';
    redSolarSystemWindow.style.overflow = 'hidden';

    setTimeout(() => {
        displayFleetsOnOrbit();
    }, 100);
}

// Функція для відкриття вікна зеленої сонячної системи
function openGreenSolarSystemWindow() {
    let greenSolarSystemWindow = document.getElementById('green-solar-system-window');

    if (!greenSolarSystemWindow) {
        greenSolarSystemWindow = document.createElement('div');
        greenSolarSystemWindow.id = 'green-solar-system-window';
        greenSolarSystemWindow.className = 'solar-system-window';
        greenSolarSystemWindow.innerHTML = `
            <div class="solar-system-title">
                <span>Зелена сонячна система</span>
                <span class="coordinates-display">(0:0)</span>
                <button class="solar-system-close-btn" onclick="closeGreenSolarSystemWindow()">✕</button>
            </div>
            <div class="solar-system-content">
                <div class="solar-center">
                    <img src="images/002.png" alt="Зелене сонце" class="solar-star-img" style="filter: hue-rotate(90deg);">
                </div>
                <div class="solar-system-objects">
                    <div class="planet-item" id="planet-item-0_0_1">
                        <span onclick="openPlanetWindow('Едем')">1 Едем (0:0:1)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:0:1')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_0_1"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_0_2">
                        <span>2 Астероїдне поле (0:0:2)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:0:2')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_0_2"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_0_3">
                        <span>3 Астероїдне поле (0:0:3)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:0:3')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_0_3"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_0_4">
                        <span>4 Астероїдне поле (0:0:4)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:0:4')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_0_4"></div>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_0_5">
                        <span>5 Астероїдне поле (0:0:5)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:0:5')">Політ</button>
                        <div class="fleet-orbit-icons" id="fleet-orbit-0_0_5"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(greenSolarSystemWindow);

        greenSolarSystemWindow.addEventListener('click', function(e) {
            if (e.target === greenSolarSystemWindow) {
                greenSolarSystemWindow.style.display = 'none';
            }
        });

        const titleBar = greenSolarSystemWindow.querySelector('.solar-system-title');
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            const rect = greenSolarSystemWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            greenSolarSystemWindow.style.left = rect.left + 'px';
            greenSolarSystemWindow.style.top = rect.top + 'px';
            greenSolarSystemWindow.style.transform = 'none';
            document.body.style.userSelect = 'none';
            bringWindowToFront(greenSolarSystemWindow);
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                greenSolarSystemWindow.style.left = newLeft + 'px';
                greenSolarSystemWindow.style.top = newTop + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    greenSolarSystemWindow.style.display = 'block';
    greenSolarSystemWindow.style.position = 'fixed';
    greenSolarSystemWindow.style.top = '50%';
    greenSolarSystemWindow.style.left = '50%';
    greenSolarSystemWindow.style.transform = 'translate(-50%, -50%)';
    greenSolarSystemWindow.style.width = '400px';
    greenSolarSystemWindow.style.height = '400px';
    greenSolarSystemWindow.style.background = '#0e3a47';
    greenSolarSystemWindow.style.border = '2px solid #1fa2c7';
    greenSolarSystemWindow.style.borderRadius = '4px';
    greenSolarSystemWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
    greenSolarSystemWindow.style.zIndex = '300';
    greenSolarSystemWindow.style.color = '#fff';
    greenSolarSystemWindow.style.overflow = 'hidden';

    setTimeout(() => {
        displayFleetsOnOrbit();
    }, 100);
}

// Функції закриття для нових сонячних систем
function closeRedSolarSystemWindow() {
    const redSolarSystemWindow = document.getElementById('red-solar-system-window');
    if (redSolarSystemWindow) {
        redSolarSystemWindow.style.display = 'none';
    }
}

function closeGreenSolarSystemWindow() {
    const greenSolarSystemWindow = document.getElementById('green-solar-system-window');
    if (greenSolarSystemWindow) {
        greenSolarSystemWindow.style.display = 'none';
    }
}

// Викликаємо побудову карти при відкритті вікна
window.renderSpaceMap = renderSpaceMap;

// Додаємо обробники подій для перетягування та зуму
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('space-map');
    if (mapContainer) {
        // Обробник для зуму карти
        mapContainer.addEventListener('wheel', function(e) {
            e.preventDefault(); // Забороняємо стандартну прокрутку
            if (e.deltaY < 0) {
                mapScale = Math.min(mapScale + 0.1, 2); // Збільшуємо масштаб
            } else {
                mapScale = Math.max(mapScale - 0.1, 0.5); // Зменшуємо м��сштаб
            }
            mapContainer.style.transform = `scale(${mapScale}) translate(${offsetX}px, ${offsetY}px)`;
        });

        // Обробники для перетягування
        mapContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragStartX = e.clientX - offsetX;
            dragStartY = e.clientY - offsetY;
            mapContainer.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                offsetX = e.clientX - dragStartX;
                offsetY = e.clientY - dragStartY;
                mapContainer.style.transform = `scale(${mapScale}) translate(${offsetX}px, ${offsetY}px)`;
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            mapContainer.style.cursor = 'grab';
        });
        
        // Встановлюємо курсор grab при наведенні
        mapContainer.style.cursor = 'grab';
    }
});

// Експортуємо функції в глобальну область
window.displayFleetsOnOrbit = displayFleetsOnOrbit;
window.showFleetTooltip = showFleetTooltip;
window.hideFleetTooltip = hideFleetTooltip;
window.openFleetDetailsFromMap = openFleetDetailsFromMap;
window.openRedSolarSystemWindow = openRedSolarSystemWindow;
window.openGreenSolarSystemWindow = openGreenSolarSystemWindow;
window.closeRedSolarSystemWindow = closeRedSolarSystemWindow;
window.closeGreenSolarSystemWindow = closeGreenSolarSystemWindow;