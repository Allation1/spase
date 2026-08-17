// Глобальна змінна для z-index вікон
let currentMaxZIndex = 200;

// Функція для підняття вікна на передній план
function bringWindowToFront(element) {
    if (element) {
        currentMaxZIndex++;
        element.style.zIndex = currentMaxZIndex;
    }
}

// Функціонал для вікна флоту
document.addEventListener('DOMContentLoaded', function() {
    // Знаходимо кнопку флоту (ракета)
    const fleetBtn = document.querySelectorAll('#buttons button')[4]; // П'ята кнопка (індекс 4)
    const fleetWindow = document.getElementById('fleet-window');

    if (fleetBtn && fleetWindow) {
        fleetBtn.addEventListener('click', function() {
            if (fleetWindow.style.display === 'none' || fleetWindow.style.display === '') {
                fleetWindow.style.display = 'block';
                bringWindowToFront(fleetWindow);
                window.windowManager?.update('fleet-window', true);
                // Оновити відображення флотів та кораблів у доці
                updateFleetsDisplay();
                updateDockShipsDisplay();
            } else {
                fleetWindow.style.display = 'none';
                window.windowManager?.update('fleet-window', false);
            }
        });

        // Додаємо можливість рухати вікно мишкою
        let isDragging = false, offsetX = 0, offsetY = 0;

        fleetWindow.querySelector('.science-window-title').addEventListener('mousedown', function(e) {
            // Дозволяємо рухати за заголовок вікна
            isDragging = true;
            offsetX = e.clientX - fleetWindow.offsetLeft;
            offsetY = e.clientY - fleetWindow.offsetTop;
            document.body.style.userSelect = 'none';
            // Піднімаємо вікно на передній план при кліку
            bringWindowToFront(fleetWindow);
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                fleetWindow.style.left = (e.clientX - offsetX) + 'px';
                fleetWindow.style.top = (e.clientY - offsetY) + 'px';
                window.windowManager?.update('fleet-window', true, {
                    left: fleetWindow.style.left, top: fleetWindow.style.top
                });
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    // Додаємо обробник для кнопки створення флоту
    const createFleetBtn = document.getElementById('create-fleet-btn');
    if (createFleetBtn) {
        createFleetBtn.addEventListener('click', function() {
            openCreateFleetWindow();
            updateDockShipsDisplay();
        });
    }

    // Функціонал для вікна Проектів (кнопка 🏗️)
    const projectsBtn = document.querySelectorAll('#buttons button')[7]; // Восьма кнопка (індекс 7)
    const projectsWindow = document.getElementById('projects-window');

    if (projectsBtn && projectsWindow) {
        projectsBtn.addEventListener('click', function() {
            if (projectsWindow.style.display === 'none' || projectsWindow.style.display === '') {
                projectsWindow.style.display = 'block';
                bringWindowToFront(projectsWindow);
                window.windowManager?.update('projects-window', true);
                renderProjects(); // Відобразити проекти при відкритті
            } else {
                projectsWindow.style.display = 'none';
                window.windowManager?.update('projects-window', false);
            }
        });

        // Додаємо можливість рухати вікно мишкою
        let isDragging = false, offsetX = 0, offsetY = 0;

        projectsWindow.querySelector('.science-window-title').addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - projectsWindow.offsetLeft;
            offsetY = e.clientY - projectsWindow.offsetTop;
            document.body.style.userSelect = 'none';
            bringWindowToFront(projectsWindow);
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                projectsWindow.style.left = (e.clientX - offsetX) + 'px';
                projectsWindow.style.top = (e.clientY - offsetY) + 'px';
                window.windowManager?.update('projects-window', true, {
                    left: projectsWindow.style.left, top: projectsWindow.style.top
                });
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    // Обробник для кнопки скидання гри
    const resetBtn = document.getElementById('reset-game-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            if (confirm('Ви впевнені, що хочете скинути ВЕСЬ прогрес гри? Цю дію неможливо скасувати.')) {
                try {
                    // 1. Відправляємо запит на сервер для скидання файлів
                    const response = await fetch('/api/reset-game', { method: 'POST' });
                    const result = await response.json();

                    if (result.success) {
                        // 2. Очищуємо localStorage на клієнті
                        localStorage.clear();
                        console.log('localStorage очищено.');

                        // 3. Перезавантажуємо сторінку
                        alert('Прогрес гри скинуто. Сторінку буде перезавантажено.');
                        window.location.reload();
                    } else {
                        alert('Помилка під час скидання прогресу на сервері: ' + result.message);
                    }
                } catch (error) {
                    alert('Сталася помилка: ' + error.message);
                    console.error('Помилка під час скидання гри:', error);
                }
            }
        });
    }
});

// Змінна для зберігання поточного обраного флоту
let currentSelectedFleet = null;

// Функція для відображення складу флоту
function showFleetComposition(fleetName) {
    // Зберігаємо назву поточного флоту
    currentSelectedFleet = fleetName;
    
    // Створюємо або отримуємо вікно складу флоту
    let fleetDetailsWindow = document.getElementById('fleet-details-window');

    if (!fleetDetailsWindow) {
        fleetDetailsWindow = document.createElement('div');
        fleetDetailsWindow.id = 'fleet-details-window';
        fleetDetailsWindow.className = 'fleet-details-window';
        fleetDetailsWindow.innerHTML = `
            <button class="science-close-btn" onclick="closeFleetDetailsWindow()">✕</button>
            <div class="science-window-title">Склад флоту</div>
            <div class="fleet-details-content">
                <div class="fleet-ship">
                    <div class="ship-info">
                        <div class="ship-name">Винищувач</div>
                        <div class="ship-count">Кількість: <span id="ship-count">10</span></div>
                    </div>
                    <div class="ship-stats">
                        <div class="ship-health">Здоров'я: <span id="ship-health">100</span>/100</div>
                        <div class="ship-weapon">Озброєння: Легкий лазер (урон: 1)</div>
                    </div>
                </div>
                <div class="fleet-actions">
                    <button class="fleet-action-btn" onclick="fleetAction('repair')">Ремонт</button>
                    <button class="fleet-action-btn" onclick="fleetAction('upgrade')">Модернізація</button>
                    <button class="fleet-action-btn" onclick="fleetAction('deploy')">Відправити</button>
                </div>
                <div class="fleet-settings">
                    <button class="fleet-settings-btn" onclick="showFleetSettings()">Налаштування флоту</button>
                </div>
            </div>
        `;
        document.body.appendChild(fleetDetailsWindow);
    }

    // Показуємо вікно
    fleetDetailsWindow.style.display = 'block';
    bringWindowToFront(fleetDetailsWindow);
    fleetDetailsWindow.style.position = 'fixed';
    fleetDetailsWindow.style.top = '50%';
    fleetDetailsWindow.style.left = '50%';
    fleetDetailsWindow.style.transform = 'translate(-50%, -50%)';
    fleetDetailsWindow.style.width = '400px';
    fleetDetailsWindow.style.height = '300px';
    fleetDetailsWindow.style.background = '#0e3a47';
    fleetDetailsWindow.style.border = '2px solid #1fa2c7';
    fleetDetailsWindow.style.borderRadius = '4px';
    fleetDetailsWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
    fleetDetailsWindow.style.zIndex = '300';
    fleetDetailsWindow.style.color = '#fff';
    fleetDetailsWindow.style.overflow = 'hidden';
    
    // Додаємо можливість перетягування вікна
    let isDragging = false;
    let offsetX, offsetY;

    const titleBar = fleetDetailsWindow.querySelector('.science-window-title');
    titleBar.addEventListener('mousedown', function(e) {
        isDragging = true;

        // Отримуємо поточну візуальну позицію вікна (з урахуванням transform)
        const rect = fleetDetailsWindow.getBoundingClientRect();

        // Зберігаємо відступ курсора від лівого верхнього кута вікна
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Встановлюємо left/top у поточну візуальну позицію перед прибиранням transform
        fleetDetailsWindow.style.left = rect.left + 'px';
        fleetDetailsWindow.style.top = rect.top + 'px';

        // Прибираємо transform щоб уникнути зміщень при подальшому перетягуванні
        fleetDetailsWindow.style.transform = 'none';

        // Піднімаємо вікно на передній план при кліку
        bringWindowToFront(fleetDetailsWindow);

        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            // Розраховуємо нові координати вікна
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            fleetDetailsWindow.style.left = newLeft + 'px';
            fleetDetailsWindow.style.top = newTop + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}

// Функція для дій з флотом
function fleetAction(action) {
    // Перевіряємо, чи вибрано флот
    if (!currentSelectedFleet) {
        alert('Спочатку оберіть флот!');
        return;
    }
    
    switch(action) {
        case 'repair':
            alert(`Ремонт флоту: ${currentSelectedFleet}`);
            break;
        case 'upgrade':
            alert(`Модернізація флоту: ${currentSelectedFleet}`);
            break;
        case 'deploy':
            alert(`Відправлення флоту: ${currentSelectedFleet}`);
            // Тут буде логіка відправлення флоту на карту
            break;
    }
}

// Функція для закриття вікна карти
function closeMapWindow() {
    const mapWindow = document.getElementById('map-window');
    if (mapWindow) {
        window.windowManager?.update('map-window', false);
        mapWindow.style.display = 'none';
    }
}

// Функція для закриття вікна флоту
function closeFleetWindow() {
    const fleetWindow = document.getElementById('fleet-window');
    if (fleetWindow) {
        window.windowManager?.update('fleet-window', false);
        fleetWindow.style.display = 'none';
    }
}

// Функція для закриття вікна складу флоту
function closeFleetDetailsWindow() {
    const fleetDetailsWindow = document.getElementById('fleet-details-window');
    if (fleetDetailsWindow) {
        fleetDetailsWindow.style.display = 'none';
    }
}

// Функція для закриття вікна налаштувань флоту
function closeFleetSettingsWindow() {
    const fleetSettingsWindow = document.getElementById('fleet-settings-window');
    if (fleetSettingsWindow) {
        fleetSettingsWindow.style.display = 'none';
    }
}

// Функція для відображення налаштувань флоту
function showFleetSettings() {
    // Створюємо або отримуємо вікно налаштувань флоту
    let fleetSettingsWindow = document.getElementById('fleet-settings-window');
    
    if (!fleetSettingsWindow) {
        fleetSettingsWindow = document.createElement('div');
        fleetSettingsWindow.id = 'fleet-settings-window';
        fleetSettingsWindow.className = 'fleet-settings-window';
        fleetSettingsWindow.innerHTML = `
            <button class="science-close-btn" onclick="closeFleetSettingsWindow()">✕</button>
            <div class="science-window-title">Налаштування флоту</div>
            <div class="fleet-settings-content">
                <div class="fleet-modes">
                    <h3>Режими флоту:</h3>
                    <div class="mode-option">
                        <input type="radio" id="patrol" name="fleet-mode" value="patrol" checked>
                        <label for="patrol">Патруль</label>
                    </div>
                    <div class="mode-option">
                        <input type="radio" id="attack-all" name="fleet-mode" value="attack-all">
                        <label for="attack-all">Атакувати всіх</label>
                    </div>
                    <div class="mode-option">
                        <input type="radio" id="drift" name="fleet-mode" value="drift">
                        <label for="drift">Дрейф</label>
                    </div>
                </div>
                <div class="battlefield-grid">
                    <h3>Поле бою (10x10):</h3>
                    <div id="battlefield" class="battlefield"></div>
                </div>
                <div class="fleet-placement-info">
                    <p>Флот буде розміщено у перших двох вертикальних лініях зліва при початку бою</p>
                </div>
                <div class="fleet-save-settings">
                    <button class="save-settings-btn" onclick="saveFleetSettings()">Зберегти налаштування</button>
                </div>
            </div>
        `;
        document.body.appendChild(fleetSettingsWindow);
    }

    // Показуємо вікно
    fleetSettingsWindow.style.display = 'block';
    fleetSettingsWindow.style.transform = 'translate(-50%, -50%)'; // Повертаємо для центрування
    bringWindowToFront(fleetSettingsWindow);
    fleetSettingsWindow.style.position = 'fixed';
    fleetSettingsWindow.style.top = '50%';
    fleetSettingsWindow.style.left = '50%';
    fleetSettingsWindow.style.transform = 'translate(-50%, -50%)';
    fleetSettingsWindow.style.width = '600px';
    fleetSettingsWindow.style.height = '500px';
    fleetSettingsWindow.style.background = '#0e3a47';
    fleetSettingsWindow.style.border = '2px solid #1fa2c7';
    fleetSettingsWindow.style.borderRadius = '4px';
    fleetSettingsWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
    fleetSettingsWindow.style.zIndex = '350';
    fleetSettingsWindow.style.color = '#fff';
    fleetSettingsWindow.style.overflow = 'hidden';
    
    // Додаємо можливість перетягування вікна
    let isDragging = false;
    let offsetX, offsetY;

    const titleBar = fleetSettingsWindow.querySelector('.science-window-title');
    titleBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        
        // Отримуємо поточну візуальну позицію вікна (з урахуванням transform)
        const rect = fleetSettingsWindow.getBoundingClientRect();
        
        // Зберігаємо відступ курсора від лівого верхнього кута вікна
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Встановлюємо left/top у поточну візуальну позицію перед прибиранням transform
        fleetSettingsWindow.style.left = rect.left + 'px';
        fleetSettingsWindow.style.top = rect.top + 'px';
        
        // Прибираємо transform щоб уникнути зміщень при подальшому перетягуванні
        fleetSettingsWindow.style.transform = 'none';
        
        document.body.style.userSelect = 'none';
        // Піднімаємо вікно на передній план при кліку
        bringWindowToFront(fleetSettingsWindow);
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            fleetSettingsWindow.style.left = newLeft + 'px';
            fleetSettingsWindow.style.top = newTop + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });
    
    // Створюємо поле бою 10x10
    createBattlefieldGrid();
}

// Функція для збереження налаштувань флоту
function saveFleetSettings() {
    // Отримуємо вибраний режим
    const selectedMode = document.querySelector('input[name="fleet-mode"]:checked').value;
    
    // Отримуємо позиції флоту на полі бою
    const battlefield = document.getElementById('battlefield');
    const fleetPositions = [];
    
    if (battlefield) {
        const cells = battlefield.querySelectorAll('.battlefield-cell');
        
        cells.forEach(cell => {
            if (cell.querySelector('.fleet-marker')) {
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                fleetPositions.push({row: parseInt(row), col: parseInt(col)});
            }
        });
    }
    
    // Зберігаємо налаштування у localStorage
    const fleetSettings = {
        mode: selectedMode,
        positions: fleetPositions
    };
    
    localStorage.setItem('fleetSettings', JSON.stringify(fleetSettings));
    
    alert(`Налаштування флоту збережено!\nРежим: ${selectedMode}\nКількість позицій: ${fleetPositions.length}`);
}

// Функція для створення поля бою 10x10
function createBattlefieldGrid() {
    const battlefield = document.getElementById('battlefield');
    if (!battlefield) return;
    
    // Очищаємо попередній вміст
    battlefield.innerHTML = '';
    
    // Створюємо сітку 10x10
    battlefield.style.display = 'grid';
    battlefield.style.gridTemplateColumns = 'repeat(10, 1fr)';
    battlefield.style.gridTemplateRows = 'repeat(10, 1fr)';
    battlefield.style.gap = '1px';
    battlefield.style.width = '100%';
    battlefield.style.height = '300px';
    battlefield.style.backgroundColor = '#1fa2c7'; // Колір фону як у ліній сітки
    
    // Додаємо клітинки
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.className = 'battlefield-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Позначаємо перші дві вертикалі як зону розташування флоту
            if (col < 2) {
                cell.style.backgroundColor = '#17607a'; // Темніше поле для початкової позиції
            } else {
                cell.style.backgroundColor = '#0e3a47'; // Основний колір поля
            }
            
            // Додаємо координати у куток клітинки
            const coordLabel = document.createElement('div');
            coordLabel.className = 'cell-coordinate';
            coordLabel.textContent = `${col}:${row}`;
            coordLabel.style.position = 'absolute';
            coordLabel.style.top = '2px';
            coordLabel.style.left = '2px';
            coordLabel.style.fontSize = '0.6em';
            coordLabel.style.color = '#ffd700';
            cell.appendChild(coordLabel);
            
            // Додаємо обробник кліку для розміщення флоту
            cell.addEventListener('click', function() {
                // Перевіряємо, чи це дозволена область для розміщення (перші дві колонки)
                if (parseInt(this.dataset.col) < 2) {
                    // Перевіряємо, чи вже є флот у цій клітинці
                    const existingFleet = this.querySelector('.fleet-marker');
                    if (existingFleet) {
                        // Якщо є, видаляємо
                        this.removeChild(existingFleet);
                    } else {
                        // Якщо немає, додаємо маркер флоту
                        const fleetMarker = document.createElement('div');
                        fleetMarker.className = 'fleet-marker';
                        fleetMarker.textContent = '✈️';
                        fleetMarker.style.position = 'absolute';
                        fleetMarker.style.top = '50%';
                        fleetMarker.style.left = '50%';
                        fleetMarker.style.transform = 'translate(-50%, -50%)';
                        fleetMarker.style.fontSize = '1.5em';
                        fleetMarker.style.pointerEvents = 'none'; // Щоб не перешкоджало клікам
                        this.appendChild(fleetMarker);
                    }
                }
            });
            
            battlefield.appendChild(cell);
        }
    }
    
    // Відновлюємо попередньо збережені позиції флоту
    restoreFleetPositions();
}

// Функція для відновлення попередньо збережених позицій флоту
function restoreFleetPositions() {
    const savedSettings = localStorage.getItem('fleetSettings');
    if (!savedSettings) return;
    
    const settings = JSON.parse(savedSettings);
    
    // Встановлюємо вибраний режим
    const modeRadio = document.getElementById(settings.mode);
    if (modeRadio) {
        modeRadio.checked = true;
    }
    
    // Відновлюємо позиції флоту
    if (settings.positions && settings.positions.length > 0) {
        const battlefield = document.getElementById('battlefield');
        if (!battlefield) return;
        
        settings.positions.forEach(pos => {
            const cell = battlefield.querySelector(`.battlefield-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
            if (cell) {
                const fleetMarker = document.createElement('div');
                fleetMarker.className = 'fleet-marker';
                fleetMarker.textContent = '✈️';
                fleetMarker.style.position = 'absolute';
                fleetMarker.style.top = '50%';
                fleetMarker.style.left = '50%';
                fleetMarker.style.transform = 'translate(-50%, -50%)';
                fleetMarker.style.fontSize = '1.5em';
                fleetMarker.style.pointerEvents = 'none';
                cell.appendChild(fleetMarker);
            }
        });
    }
}

// Функція для закриття вікна карти
function closeMapWindow() {
    const mapWindow = document.getElementById('map-window');
    if (mapWindow) {
        mapWindow.style.display = 'none';
    }
}

// Функція для закриття вікна флоту
function closeFleetWindow() {
    const fleetWindow = document.getElementById('fleet-window');
    if (fleetWindow) {
        fleetWindow.style.display = 'none';
    }
}

// Функція для закриття вікна Проектів
function closeProjectsWindow() {
    const projectsWindow = document.getElementById('projects-window');
    if (projectsWindow) {
        window.windowManager?.update('projects-window', false);
        projectsWindow.style.display = 'none';
    }
}

// Функція для відображення проектів
function renderProjects() {
    const projectsContent = document.getElementById('projects-content');
    if (!projectsContent) return;

    // Отримуємо список проектів
    let projects = [];
    try {
        const savedData = localStorage.getItem('shipProjects');
        if (savedData) {
            projects = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('Помилка при отриманні проектів:', e);
    }

    let html = `
        <div style="padding: 10px;">
            <button id="develop-btn" style="
                padding: 8px 15px;
                background: #1fa2c7;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 15px;
            ">🔨 Розробити новий проект</button>
            
            <h3 style="color: #1fa2c7; margin-bottom: 10px;">📋 Готові проекти</h3>
    `;

    if (projects.length === 0) {
        html += `<p style="color: #aaa;">Немає збережених проектів</p>`;
    } else {
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">`;
        projects.forEach((project, index) => {
            html += `
                <div class="science-section" style="background: #134d5c; border: 1px solid #1fa2c7; border-radius: 4px; padding: 15px;">
                    <div style="font-size: 1.2em; margin-bottom: 10px; font-weight: bold;">🚀 ${project.name}</div>
                    <div style="color: #aaa; font-size: 0.9em; margin-bottom: 5px;">Рівень корабля: <span style="color: #4ade80;">${project.shipLevel}</span></div>
                    <div style="color: #aaa; font-size: 0.9em; margin-bottom: 5px;">Гармати: <span style="color: #4ade80;">${project.weaponsCount}</span> шт (рівень ${project.weaponLevel})</div>
                    <div style="color: #aaa; font-size: 0.85em; margin-top: 10px;">Створено: ${project.createdAt}</div>
                    <button onclick="deleteProject(${index})" style="
                        margin-top: 10px;
                        padding: 5px 10px;
                        background: #dc2626;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.85em;
                    ">🗑️ Видалити</button>
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    projectsContent.innerHTML = html;

    // Додаємо обробник для кнопки "Розробити"
    document.getElementById('develop-btn').addEventListener('click', openShipDesignWindow);
}

// Функція для відкриття вікна проектування
function openShipDesignWindow() {
    const designWindow = document.getElementById('ship-design-window');
    const designContent = document.getElementById('ship-design-content');

    // Отримуємо рівні наук
    let shipFighterLevel = 0;
    let laserWeaponLevel = 0;
    try {
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            shipFighterLevel = levels.ship_fighter || 0;
            laserWeaponLevel = levels.weapon_laser || 0;
        }
    } catch (e) {
        console.error('Помилка при отриманні рівнів наук:', e);
    }

    designContent.innerHTML = `
        <div style="padding: 15px;">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">🚀 Назва проекту:</label>
                <input type="text" id="project-name" placeholder="Введіть назву" style="
                    width: 100%;
                    padding: 8px;
                    background: #134d5c;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                ">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">🚀 Рівень винищувача (макс ${shipFighterLevel}):</label>
                <input type="number" id="ship-level" min="1" max="${shipFighterLevel}" value="1" style="
                    width: 80px;
                    padding: 8px;
                    background: #134d5c;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    text-align: center;
                ">
                <span style="color: #aaa; font-size: 0.85em; margin-left: 10px;">Доступно: ${shipFighterLevel}</span>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">🔫 Кількість гармат (макс 2):</label>
                <select id="weapons-count" style="
                    padding: 8px;
                    background: #134d5c;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                ">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;" id="weapon-level-div">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">🔫 Рівень гармат (макс ${laserWeaponLevel}):</label>
                <input type="number" id="weapon-level" min="1" max="${laserWeaponLevel}" value="1" style="
                    width: 80px;
                    padding: 8px;
                    background: #134d5c;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    text-align: center;
                ">
                <span style="color: #aaa; font-size: 0.85em; margin-left: 10px;">Доступно: ${laserWeaponLevel}</span>
            </div>

            <div style="margin-top: 20px;">
                <button onclick="saveShipProject()" style="
                    padding: 10px 20px;
                    background: #1fa2c7;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-right: 10px;
                ">💾 Зберегти проект</button>
                <button onclick="closeShipDesignWindow()" style="
                    padding: 10px 20px;
                    background: #555;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">✕ Скасувати</button>
            </div>
        </div>
    `;

    // Показуємо/ховаємо поле рівня гармат
    const weaponsCountSelect = document.getElementById('weapons-count');
    const weaponLevelDiv = document.getElementById('weapon-level-div');
    if (weaponsCountSelect.value === '0') {
        weaponLevelDiv.style.display = 'none';
    }
    weaponsCountSelect.addEventListener('change', function() {
        if (this.value === '0') {
            weaponLevelDiv.style.display = 'none';
        } else {
            weaponLevelDiv.style.display = 'block';
        }
    });

    designWindow.style.display = 'block';
    bringWindowToFront(designWindow);
}

// Функція для збереження проекту корабля
function saveShipProject() {
    const nameInput = document.getElementById('project-name');
    const shipLevelInput = document.getElementById('ship-level');
    const weaponsCountInput = document.getElementById('weapons-count');
    const weaponLevelInput = document.getElementById('weapon-level');

    const name = nameInput.value.trim();
    const shipLevel = parseInt(shipLevelInput.value);
    const weaponsCount = parseInt(weaponsCountInput.value);
    const weaponLevel = parseInt(weaponLevelInput.value);

    // Перевірки
    if (!name) {
        alert('❌ Введіть назву проекту');
        return;
    }

    if (shipLevel < 1) {
        alert('❌ Рівень корабля має бути не менше 1');
        return;
    }

    if (weaponsCount < 0 || weaponsCount > 2) {
        alert('❌ Кількість гармат має бути від 0 до 2');
        return;
    }

    if (weaponsCount > 0 && weaponLevel < 1) {
        alert('❌ Рівень гармат має бути не менше 1');
        return;
    }

    // Перевірка рівнів наук
    let shipFighterLevel = 0;
    let laserWeaponLevel = 0;
    try {
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            shipFighterLevel = levels.ship_fighter || 0;
            laserWeaponLevel = levels.weapon_laser || 0;
        }
    } catch (e) {
        console.error('Помилка при отриманні рівнів наук:', e);
    }

    if (shipLevel > shipFighterLevel) {
        alert(`❌ Недостатній рівень науки "Винищувач"! Вивчено: ${shipFighterLevel}, потрібно: ${shipLevel}`);
        return;
    }

    if (weaponsCount > 0 && weaponLevel > laserWeaponLevel) {
        alert(`❌ Недостатній рівень науки "Лазерна гармата"! Вивчено: ${laserWeaponLevel}, потрібно: ${weaponLevel}`);
        return;
    }

    // Створюємо проект
    const project = {
        name: name,
        shipLevel: shipLevel,
        weaponsCount: weaponsCount,
        weaponLevel: weaponsCount > 0 ? weaponLevel : 0,
        createdAt: new Date().toLocaleDateString('uk-UA')
    };

    // Зберігаємо у localStorage
    let projects = [];
    try {
        const savedData = localStorage.getItem('shipProjects');
        if (savedData) {
            projects = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('Помилка при отриманні проектів:', e);
    }

    projects.push(project);
    localStorage.setItem('shipProjects', JSON.stringify(projects));

    alert('✅ Проект збережено!');
    closeShipDesignWindow();
    renderProjects();
}

// Функція для закриття вікна проектування
function closeShipDesignWindow() {
    const designWindow = document.getElementById('ship-design-window');
    if (designWindow) {
        designWindow.style.display = 'none';
    }
}

// Функція для видалення проекту
function deleteProject(index) {
    if (!confirm('Видалити цей проект?')) return;

    let projects = [];
    try {
        const savedData = localStorage.getItem('shipProjects');
        if (savedData) {
            projects = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('Помилка при отриманні проектів:', e);
    }

    projects.splice(index, 1);
    localStorage.setItem('shipProjects', JSON.stringify(projects));
    renderProjects();
}
