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
            } else {
                fleetWindow.style.display = 'none';
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
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
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
                renderProjects(); // Відобразити проекти при відкритті
            } else {
                projectsWindow.style.display = 'none';
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
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
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
        projectsWindow.style.display = 'none';
    }
}

// Функція для відображення проектів
function renderProjects() {
    const projectsContent = document.getElementById('projects-content');
    if (!projectsContent) return;

    // Отримуємо рівень інженерного центру
    let engineerCenterLevel = 0;
    try {
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            engineerCenterLevel = levels.building_engineer_center || 0;
        }
    } catch (e) {
        console.error('Помилка при отриманні рівня інженерного центру:', e);
    }

    if (engineerCenterLevel === 0) {
        projectsContent.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #aaa;">
                <p>🚧 Для розробки проектів потрібен Інженерний центр</p>
                <p>Побудуйте Інженерний центр у вкладці "Будівлі" на планеті Тера</p>
            </div>
        `;
        return;
    }

    // Відображаємо доступні проекти
    projectsContent.innerHTML = `
        <div style="padding: 20px;">
            <h3 style="color: #1fa2c7; margin-bottom: 15px;">📋 Доступні проекти</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                <div class="science-section" style="background: #134d5c; border: 1px solid #1fa2c7; border-radius: 4px; padding: 15px;">
                    <div style="font-size: 1.2em; margin-bottom: 10px;">🚀 Кораблі</div>
                    <div style="color: #aaa; font-size: 0.9em; margin-bottom: 10px;">Дослідження космічного простору</div>
                    <div style="color: #4ade80; font-size: 0.85em;">Рівень інженерного центру: ${engineerCenterLevel}</div>
                    <button style="margin-top: 10px; padding: 8px 15px; background: #1fa2c7; color: white; border: none; border-radius: 4px; cursor: pointer;">Розробити</button>
                </div>
                <div class="science-section" style="background: #134d5c; border: 1px solid #1fa2c7; border-radius: 4px; padding: 15px;">
                    <div style="font-size: 1.2em; margin-bottom: 10px;">🚀 Космічна станція</div>
                    <div style="color: #aaa; font-size: 0.9em; margin-bottom: 10px;">Орбітальна дослідницька станція</div>
                    <div style="color: #f59e0b; font-size: 0.85em;">Потрібен рівень: 3</div>
                    <button style="margin-top: 10px; padding: 8px 15px; background: #555; color: #aaa; border: none; border-radius: 4px; cursor: not-allowed;" disabled>Заблоковано</button>
                </div>
            </div>
        </div>
    `;
}
