let mapScale = 1;

function renderSpaceMap() {
    const mapContainer = document.getElementById('space-map');
    if (!mapContainer) return;
    mapContainer.innerHTML = '';
    mapContainer.style.transform = `scale(${mapScale})`;
    mapContainer.style.transformOrigin = '0 0';

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            const cell = document.createElement('div');
            cell.className = 'space-cell';

            // Додаємо координати у кутку
            const label = document.createElement('div');
            label.className = 'space-cell-label';
            label.textContent = `${x}:${y}`;
            cell.appendChild(label);

            // Додаємо сонце у клітинку з координатами 1:1
            if (x === 1 && y === 1) {
                const sun = document.createElement('div');
                sun.className = 'sun';
                sun.addEventListener('click', function(e) {
                    e.stopPropagation(); // Зупиняємо поширення події
                    openSolarSystemWindow();
                });
                cell.appendChild(sun);
            }
            
            // Додаємо другу сонячну систему у клітинку з координатами 0:2
            if (x === 0 && y === 2) {
                const blueSun = document.createElement('div');
                blueSun.className = 'blue-sun';
                blueSun.addEventListener('click', function(e) {
                    e.stopPropagation(); // Зупиняємо поширення події
                    openBlueSolarSystemWindow();
                });
                cell.appendChild(blueSun);
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
                <span class="coordinates-display">(1:1)</span>
                <button class="solar-system-close-btn" onclick="closeSolarSystemWindow()">✕</button>
            </div>
            <div class="solar-system-content">
                <div class="solar-center">
                    <img src="images/002.png" alt="Сонце" class="solar-star-img">
                </div>
                <div class="solar-system-objects">
                    <div class="planet-item" id="planet-item-1_1_1">
                        <span onclick="openPlanetWindow('Тера')">1 Тера (1:1:1)</span>
                        <span class="fleet-icon-orbit" onclick="showFleetWindow()" title="Флот на орбіті">✈️</span>
                        <button class="flight-btn" onclick="initiateFlight('1:1:1')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-1_1_2">
                        <span>2 Астероїдне поле (1:1:2)</span>
                        <button class="flight-btn" onclick="initiateFlight('1:1:2')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-1_1_3">
                        <span>3 Астероїдне поле (1:1:3)</span>
                        <button class="flight-btn" onclick="initiateFlight('1:1:3')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-1_1_4">
                        <span>4 Астероїдне поле (1:1:4)</span>
                        <button class="flight-btn" onclick="initiateFlight('1:1:4')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-1_1_5">
                        <span>5 Астероїдне поле (1:1:5)</span>
                        <button class="flight-btn" onclick="initiateFlight('1:1:5')">Політ</button>
                    </div>
                </div>
                <div class="fleet-icons-overlay">
                    <div class="fleet-icon-container" id="fleet-icon-1_1_1"></div>
                    <div class="fleet-icon-container" id="fleet-icon-1_1_2"></div>
                    <div class="fleet-icon-container" id="fleet-icon-1_1_3"></div>
                    <div class="fleet-icon-container" id="fleet-icon-1_1_4"></div>
                    <div class="fleet-icon-container" id="fleet-icon-1_1_5"></div>
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
            // Враховуємо початкове положення вікна
            const rect = solarSystemWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
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
    
    // Оновлюємо відображення флоту після відкриття вікна
    setTimeout(() => {
        console.log('Opening solar system window, currentFleetOrbit:', currentFleetOrbit);
        if (currentFleetOrbit) {
            console.log('Calling updateFleetOrbitDisplay to show fleet at orbit:', currentFleetOrbit);
            updateFleetOrbitDisplay(null, currentFleetOrbit);
        }
        
        // Також викликаємо позиціонування іконок флоту
        positionFleetIcons();
    }, 100); // Затримка для того, щоб вікно повністю завантажилось
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
function initiateFlight(destination) {
    // Перевіряємо, чи вікно складу флоту відкрите
    const fleetDetailsWindow = document.getElementById('fleet-details-window');
    if (!fleetDetailsWindow || fleetDetailsWindow.style.display === 'none') {
        alert('Щоб виконати політ, спочатку відкрийте склад флоту (клікніть на флот у вікні Флоти)');
        return;
    }

    // Перевіряємо, чи обрано флот
    if (typeof currentSelectedFleet === 'undefined' || !currentSelectedFleet) {
        alert('Спочатку оберіть флот для відправлення');
        return;
    }

    // Визначаємо, з якої орбіти вилітає флот (якщо він був десь)
    let fromOrbit = null;
    if (currentFleetOrbit) {
        fromOrbit = currentFleetOrbit; // Зберігаємо повні координати попередньої орбіти
    }

    // Оновлюємо поточну орбіту флоту
    currentFleetOrbit = destination;

    // Оновлюємо відображення флоту (приховуємо з попередньої орбіти)
    if (fromOrbit !== null) {
        updateFleetOrbitDisplay(fromOrbit, null); // Приховуємо флот з попередньої орбіти
    }

    // Показуємо флот на новій орбіті після затримки, щоб дати час на анімацію
    setTimeout(() => {
        updateFleetOrbitDisplay(null, currentFleetOrbit); // Показуємо флот на новій орбіті
        positionFleetIcons(); // Оновлюємо позиціонування іконок флоту
    }, 1000); // Затримка 1 секунда для того, щоб анімація завершилася

    // Отримуємо збережені налаштування флоту
    const savedSettings = localStorage.getItem('fleetSettings');
    if (!savedSettings) {
        alert('Немає збережених налаштувань флоту');
        return;
    }

    const settings = JSON.parse(savedSettings);

    // Виконуємо анімацію польоту
    animateFleetMovement(destination);

    // Повідомляємо про початок польоту
    console.log(`Флот "${currentSelectedFleet}" вирушає до: ${destination}`);
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
                
                // Знаходимо клітинку за координатами
                const cellIndex = y * 3 + x; // Для сітки 3x3 - це правильна формула
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
        // У нашій сітці: індекс 0 - (0,0), індекс 1 - (1,0), індекс 2 - (2,0)
        // індекс 3 - (0,1), індекс 4 - (1,1), індекс 5 - (2,1)
        // індекс 6 - (0,2), індекс 7 - (1,2), індекс 8 - (2,2)
        const cellIndex = y * 3 + x; // Для сітки 3x3 - це правильна формула
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
                <span class="coordinates-display">(0:2)</span>
                <button class="solar-system-close-btn" onclick="closeBlueSolarSystemWindow()">✕</button>
            </div>
            <div class="solar-system-content">
                <div class="solar-center">
                    <img src="images/003.png" alt="Блакитне сонце" class="blue-solar-star-img">
                </div>
                <div class="asteroid-fields-container">
                    <div class="asteroid-field" id="asteroid-field-0_2_1">
                        <span>1 Астероїдне поле (0:2:1)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:2:1')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_2_2">
                        <span>2 Астероїдне поле (0:2:2)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:2:2')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_2_3">
                        <span>3 Астероїдне поле (0:2:3)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:2:3')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_2_4">
                        <span>4 Астероїдне поле (0:2:4)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:2:4')">Політ</button>
                    </div>
                    <div class="asteroid-field" id="asteroid-field-0_2_5">
                        <span>5 Астероїдне поле (0:2:5)</span>
                        <button class="flight-btn" onclick="initiateFlight('0:2:5')">Політ</button>
                    </div>
                </div>
                <div class="fleet-icons-overlay">
                    <div class="fleet-icon-container" id="fleet-icon-0_2_1"></div>
                    <div class="fleet-icon-container" id="fleet-icon-0_2_2"></div>
                    <div class="fleet-icon-container" id="fleet-icon-0_2_3"></div>
                    <div class="fleet-icon-container" id="fleet-icon-0_2_4"></div>
                    <div class="fleet-icon-container" id="fleet-icon-0_2_5"></div>
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
            offsetX = e.clientX - blueSolarSystemWindow.getBoundingClientRect().left;
            offsetY = e.clientY - blueSolarSystemWindow.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
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
    
    // Оновлюємо відображення флоту після відкриття вікна
    setTimeout(() => {
        console.log('Opening solar system window, currentFleetOrbit:', currentFleetOrbit);
        if (currentFleetOrbit) {
            console.log('Calling updateFleetOrbitDisplay to show fleet at orbit:', currentFleetOrbit);
            updateFleetOrbitDisplay(null, currentFleetOrbit);
        }
        
        // Також викликаємо позиціонування іконок флоту
        positionFleetIcons();
    }, 100); // Затримка для того, щоб вікно повністю завантажилось
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
                mapScale = Math.max(mapScale - 0.1, 0.5); // Зменшуємо масштаб
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