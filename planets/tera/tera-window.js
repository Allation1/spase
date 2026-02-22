// Спрощене вікно для планети Тера

// Оголошуємо дані прямо в файлі
let terraData = {
    id: 'terra',
    name: 'Тера',
    type: 'Головна планета',
    description: 'Головна планета гравітаційної системи',
    resources: {
        "Населення": 100,
        "Вода": 50,
        "Деревина": 50,
        "Каміння": 50
    },
    buildings: [
        { id: 'building_center', name: 'Науковий центр', level: 1 },
        { id: 'building_source', name: 'Джерело', level: 1 }
    ],
    research: [
        { id: 'physics', name: 'Фізика', completed: false },
        { id: 'chemistry', name: 'Хімія', completed: false }
    ]
};

// Функція для оновлення відображення ресурсів (ресурси тепер оновлюються на сервері)
function startResourceDisplayUpdates() {
    // Перевіряємо, чи вже запущено інтервал
    if (window.resourceDisplayUpdateInterval) {
        clearInterval(window.resourceDisplayUpdateInterval);
    }

    // Створюємо інтервал для оновлення відображення ресурсів кожні 2 секунди
    window.resourceDisplayUpdateInterval = setInterval(async () => {
        try {
            // Отримуємо актуальні ресурси з сервера
            const response = await fetch('/api/resources');
            if (response.ok) {
                const serverResources = await response.json();

                // Оновлюємо локальні дані ресурсів
                terraData.resources = serverResources;

                // Оновлюємо відображення ресурсів, якщо вікно відкрите
                updateResourcesDisplay();
            }
        } catch (error) {
            console.error('Помилка при отриманні ресурсів з сервера:', error);
        }
    }, 2000); // Кожні 2 секунди

    console.log('Оновлення відображення ресурсів запущено');
}

// Запускаємо оновлення відображення ресурсів при завантаженні скрипта
startResourceDisplayUpdates();

// Спробуємо отримати актуальні дані з файлу
fetch('/planets/tera/data.json')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Файл не знайдено');
    })
    .then(data => {
        terraData = data;
    })
    .catch(error => {
        console.error('Помилка при отриманні даних планети Тера:', error);
        // Використовуємо стандартні значення при помилці
    });

function renderTeraWindow() {
    // Отримуємо або створюємо вікно Тера
    let terraWindow = document.getElementById('terra-window');

    if (!terraWindow) {
        terraWindow = document.createElement('div');
        terraWindow.id = 'terra-window';
        terraWindow.className = 'science-details-window';
        terraWindow.innerHTML = `
            <div class="science-details-header">
                <div class="science-details-title">🪐 ${terraData.name}</div>
                <button class="science-close-btn">✕</button>
            </div>
            <div style="display: flex; margin-bottom: 10px;">
                <button id="tera-planet-tab-btn" style="
                    background: #1fa2c7;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px 4px 0 0;
                    padding: 5px 10px;
                    cursor: pointer;
                    margin-right: 2px;
                ">Ресурси</button>
                <button id="tera-buildings-tab-btn" style="
                    background: #17607a;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px 4px 0 0;
                    padding: 5px 10px;
                    cursor: pointer;
                ">Будівлі</button>
            </div>
            <div id="tera-tabs-content" style="
                padding: 10px;
                background: #0e3a47;
                border: 2px solid #1fa2c7;
                border-radius: 0 0 4px 4px;
                min-height: 200px;
            ">
                <div id="tera-planet-tab-content" style="display: block;">
                    <!-- Вкладки ресурсів -->
                    <div style="display: flex; margin-bottom: 10px;">
                        <button id="tera-basic-res-tab-btn" style="
                            background: #1fa2c7;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                            margin-right: 2px;
                        ">Базові</button>
                        <button id="tera-weapons-res-tab-btn" style="
                            background: #17607a;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                            margin-right: 2px;
                        ">Зброя</button>
                        <button id="tera-population-res-tab-btn" style="
                            background: #17607a;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                        ">Населення</button>
                    </div>
                    <div id="tera-basic-res-content" style="
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <div class="resources-info">
                                <p>💧 Вода: <span id="tera-resource-water">${terraData.resources['Вода']}</span></p>
                                <p>🪵 Деревина: <span id="tera-resource-wood">${terraData.resources['Деревина']}</span></p>
                                <p>🪨 Каміння: <span id="tera-resource-stone">${terraData.resources['Каміння']}</span></p>
                            </div>
                        </div>
                    </div>
                    <div id="tera-weapons-res-content" style="
                        display: none;
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <div class="resources-info">
                                <p>🔫 Лазерна гармата: <span id="tera-resource-laser">0</span></p>
                            </div>
                        </div>
                    </div>
                    <div id="tera-population-res-content" style="
                        display: none;
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <div class="resources-info">
                                <p>👥 Населення: <span id="tera-resource-population">${terraData.resources['Населення']}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="tera-buildings-tab-content" style="display: none;">
                    <div id="tera-buildings-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px; max-height: 400px; overflow-y: auto; overflow-x: hidden;">
                        <!-- Будівлі будуть додані тут динамічно -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(terraWindow);
    }

    // Показуємо вікно
    terraWindow.style.display = 'block';
    bringWindowToFront(terraWindow);

    // Додаємо обробники для вкладок
    const planetTabBtn = document.getElementById('tera-planet-tab-btn');
    const buildingsTabBtn = document.getElementById('tera-buildings-tab-btn');
    const planetTabContent = document.getElementById('tera-planet-tab-content');
    const buildingsTabContent = document.getElementById('tera-buildings-tab-content');

    planetTabBtn.addEventListener('click', () => {
        planetTabContent.style.display = 'block';
        buildingsTabContent.style.display = 'none';
        planetTabBtn.style.background = '#1fa2c7';
        buildingsTabBtn.style.background = '#17607a';

        // Оновити відображення ресурсів
        updateResourcesDisplay();
    });

    buildingsTabBtn.addEventListener('click', () => {
        planetTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'block';
        buildingsTabBtn.style.background = '#1fa2c7';
        planetTabBtn.style.background = '#17607a';

        // Завантажити та відобразити будівлі
        loadAndRenderBuildings();
    });

    // Додаємо обробники для вкладок ресурсів
    const basicResTabBtn = document.getElementById('tera-basic-res-tab-btn');
    const weaponsResTabBtn = document.getElementById('tera-weapons-res-tab-btn');
    const populationResTabBtn = document.getElementById('tera-population-res-tab-btn');
    const basicResContent = document.getElementById('tera-basic-res-content');
    const weaponsResContent = document.getElementById('tera-weapons-res-content');
    const populationResContent = document.getElementById('tera-population-res-content');

    basicResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'block';
        weaponsResContent.style.display = 'none';
        populationResContent.style.display = 'none';
        basicResTabBtn.style.background = '#1fa2c7';
        weaponsResTabBtn.style.background = '#17607a';
        populationResTabBtn.style.background = '#17607a';
    });

    weaponsResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'none';
        weaponsResContent.style.display = 'block';
        populationResContent.style.display = 'none';
        basicResTabBtn.style.background = '#17607a';
        weaponsResTabBtn.style.background = '#1fa2c7';
        populationResTabBtn.style.background = '#17607a';
    });

    populationResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'none';
        weaponsResContent.style.display = 'none';
        populationResContent.style.display = 'block';
        basicResTabBtn.style.background = '#17607a';
        weaponsResTabBtn.style.background = '#17607a';
        populationResTabBtn.style.background = '#1fa2c7';
    });

    // Додаємо можливість рухати вікно мишкою
    let isDragging = false, offsetX = 0, offsetY = 0;

    terraWindow.querySelector('.science-details-title').addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - terraWindow.offsetLeft;
        offsetY = e.clientY - terraWindow.offsetTop;
        document.body.style.userSelect = 'none';
        // Піднімаємо вікно на передній план при кліку
        bringWindowToFront(terraWindow);
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            terraWindow.style.left = (e.clientX - offsetX) + 'px';
            terraWindow.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // Додаємо обробник для кнопки закриття
    const closeBtn = terraWindow.querySelector('.science-close-btn');
    closeBtn.onclick = () => {
        terraWindow.style.display = 'none';
    };

    // За замовчуванням показуємо вкладку планети
    planetTabContent.style.display = 'block';
    buildingsTabContent.style.display = 'none';
    planetTabBtn.style.background = '#1fa2c7';
    buildingsTabBtn.style.background = '#17607a';

    // Оновити відображення ресурсів
    updateResourcesDisplay();
}

// Функція для завантаження та відображення будівель
async function loadAndRenderBuildings() {
    try {
        const response = await fetch('/planets/tera/buildings.json');
        let buildingsData = {};

        if (response.ok) {
            buildingsData = await response.json();
        } else {
            // Якщо файл не існує, використовуємо стандартні значення
            buildingsData = {
                building_center: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                },
                building_source: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                }
            };
        }

        // Оновлюємо відображення ресурсів
        updateResourcesDisplay();

        renderBuildings(buildingsData);
    } catch (error) {
        console.error('Помилка при завантаженні даних будівель:', error);
        // Використовуємо стандартні значення при помилці
        const defaultBuildingsData = {
            building_center: {
                count: 0,
                level: 1,
                construction_time: 0
            },
            building_source: {
                count: 0,
                level: 1,
                construction_time: 0
            }
        };
        // Оновлюємо відображення ресурсів
        updateResourcesDisplay();

        renderBuildings(defaultBuildingsData);
    }
}

// Функція для оновлення відображення ресурсів
async function updateResourcesDisplay() {
    try {
        // Отримуємо останні дані з файлу
        const response = await fetch('/planets/tera/data.json');
        if (response.ok) {
            const data = await response.json();
            
            // Оновлюємо значення ресурсів, якщо вони змінюються в інших частинах гри
            if (document.getElementById('tera-resource-population')) {
                document.getElementById('tera-resource-population').textContent = data.resources['Населення'];
            }
            if (document.getElementById('tera-resource-water')) {
                document.getElementById('tera-resource-water').textContent = data.resources['Вода'];
            }
            if (document.getElementById('tera-resource-wood')) {
                document.getElementById('tera-resource-wood').textContent = data.resources['Деревина'];
            }
            if (document.getElementById('tera-resource-stone')) {
                document.getElementById('tera-resource-stone').textContent = data.resources['Каміння'];
            }
        } else {
            console.error('Помилка при отриманні даних планети Тера');
        }
    } catch (error) {
        console.error('Помилка при отриманні даних планети Тера:', error);
    }
}

// Функція для відображення будівель
function renderBuildings(buildingsData) {
    const buildingsContainer = document.getElementById('tera-buildings-container');

    // Очищуємо контейнер
    buildingsContainer.innerHTML = '';

    // Отримуємо рівень науки науковий центр
    let centerLevel = 0;
    try {
        // Спробуємо отримати рівень науки науковий центр з localStorage
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            centerLevel = levels.building_center || 0;
        }
    } catch (e) {
        console.error('Помилка при отриманні рівня науки наукового центру:', e);
    }

    // Отримуємо рівень науки джерело
    let sourceLevel = 0;
    try {
        // Спробуємо отримати рівень науки джерело з localStorage
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            sourceLevel = levels.building_source || 0;
        }
    } catch (e) {
        console.error('Помилка при отриманні рівня науки джерела:', e);
    }

    // Перевіряємо, чи можна покращити будівлю для кожної будівлі
    const canUpgradeBuilding = (buildingId, currentLevel) => {
        // Перевіряємо, чи є хоча б одна будівля
        if (buildingsData[buildingId].count <= 0) {
            return false; // Не можна покращувати, якщо немає жодної будівлі
        }

        if (buildingId === 'building_center') {
            return currentLevel < centerLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        } else if (buildingId === 'building_source') {
            return currentLevel < sourceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        } else if (buildingId === 'building_stone_quarry') {
            // Для покращення каменярні потрібен рівень науки каменярні
            let stoneQuarryScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    stoneQuarryScienceLevel = levels.stone_quarry_science || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки каменярні:', e);
            }
            return currentLevel < stoneQuarryScienceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        } else if (buildingId === 'building_wood_cutter') {
            // Для покращення лісоруба потрібен рівень науки лісоруба
            let woodCuttingScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    woodCuttingScienceLevel = levels.wood_cutting_science || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки лісоруба:', e);
            }
            return currentLevel < woodCuttingScienceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        } else if (buildingId === 'building_house') {
            // Для покращення будинку потрібен рівень науки будинку
            let houseScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    houseScienceLevel = levels.building_house || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки будинку:', e);
            }
            return currentLevel < houseScienceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        } else if (buildingId === 'building_warehouse') {
            // Для покращення складу потрібен рівень науки складу
            let warehouseScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    warehouseScienceLevel = levels.building_warehouse || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки складу:', e);
            }
            return currentLevel < warehouseScienceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        } else if (buildingId === 'building_armory') {
            // Для покращення зброярного заводу потрібен рівень науки зброярного заводу
            let armoryScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    armoryScienceLevel = levels.building_armory || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки зброярного заводу:', e);
            }
            return currentLevel < armoryScienceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
        }
        return true; // Для інших будівель немає обмежень
    };

    // Додаємо будівлі науковий центр, джерело, будинок, склад, каменярня, лісоруб та зброярний завод
    const buildings = [
        {
            id: 'building_center',
            name: 'Науковий центр',
            icon: '🔬'
        },
        {
            id: 'building_source',
            name: 'Джерело',
            icon: '💧'
        },
        {
            id: 'building_house',
            name: 'Будинок',
            icon: '🏠'
        },
        {
            id: 'building_warehouse',
            name: 'Склад',
            icon: '📦'
        },
        {
            id: 'building_stone_quarry',
            name: 'Каменярня',
            icon: '🪨'
        },
        {
            id: 'building_wood_cutter',
            name: 'Лісоруб',
            icon: '🪵'
        },
        {
            id: 'building_armory',
            name: 'Зброярний завод',
            icon: '🔫'
        }
    ];

    buildings.forEach(building => {
        const buildingData = buildingsData[building.id];
        const count = buildingData.count;
        let level = buildingData.level;

        // Обмежуємо рівень будівлі рівнем відповідної науки
        if (building.id === 'building_center') {
            level = Math.min(level, centerLevel);
        } else if (building.id === 'building_source') {
            // Отримуємо рівень науки джерело
            let sourceLevel = 0;
            try {
                // Спробуємо отримати рівень науки джерело з localStorage
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    sourceLevel = levels.building_source || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки джерела:', e);
            }
            level = Math.min(level, sourceLevel);
        } else if (building.id === 'building_house') {
            // Отримуємо рівень науки будинок
            let houseLevel = 0;
            try {
                // Спробуємо отримати рівень науки будинок з localStorage
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    houseLevel = levels.building_house || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки будинку:', e);
            }
            level = Math.min(level, houseLevel);
        } else if (building.id === 'building_warehouse') {
            // Отримуємо рівень науки склад
            let warehouseLevel = 0;
            try {
                // Спробуємо отримати рівень науки склад з localStorage
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    warehouseLevel = levels.building_warehouse || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки складу:', e);
            }
            level = Math.min(level, warehouseLevel);
        } else if (building.id === 'building_armory') {
            // Отримуємо рівень науки зброярний завод
            let armoryLevel = 0;
            try {
                // Спробуємо отримати рівень науки зброярний завод з localStorage
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    armoryLevel = levels.building_armory || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки зброярного заводу:', e);
            }
            level = Math.min(level, armoryLevel);
        }

        const buildingElement = document.createElement('div');
        buildingElement.className = 'science-section';
        buildingElement.style.cursor = 'pointer';
        
        // Для будівлі джерела додаємо відео між заголовком і кнопкою будувати
        let videoHtml = '';
        if (building.id === 'building_source') {
            videoHtml = `
                <div class="building-video-container" id="video-container-${building.id}">
                    <video class="building-video" preload="auto" loop muted playsinline poster="video/001.mp4">
                        <source src="video/001.mp4" type="video/mp4">
                        Ваш браузер не підтримує відео.
                    </video>
                </div>
            `;
        }
        
        buildingElement.innerHTML = `
            <div>
                <div class="science-block-title" style="display: flex; align-items: center; position: relative; margin-bottom: 0px;">${building.icon} ${building.name}
                    <div style="position: absolute; top: 100%; left: 0; z-index: 10;">
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            display: inline-block;
                            text-align: center;
                            width: fit-content;
                        " id="building-count-${building.id}">${count}</div>
                    </div>
                    <div style="position: absolute; top: 100%; right: 0; z-index: 10;">
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            display: inline-block;
                            text-align: center;
                            width: fit-content;
                        " id="building-level-${building.id}">${level}</div>
                    </div>
                </div>
                ${videoHtml}
            </div>
            <div class="science-controls">
                <input type="number" id="build-count-${building.id}" value="1" min="1" style="
                    width: 35px;
                    background: #0e3a47;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    padding: 2px;
                    font-size: 0.7em;
                    margin-right: 2px;
                    -moz-appearance: textfield;
                ">
                <button class="study-btn" onclick="startBuilding('${building.id}', '${building.name}')">Будувати</button>
            </div>
            <div class="science-controls">
                <input type="number" id="upgrade-level-${building.id}" value="1" min="1" style="
                    width: 35px;
                    background: #0e3a47;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    padding: 2px;
                    font-size: 0.7em;
                    margin-right: 2px;
                    -moz-appearance: textfield;
                " ${!canUpgradeBuilding(building.id, level) ? 'disabled' : ''}>
                <button class="study-btn"
                        onclick="startUpgrade('${building.id}', '${building.name}')"
                        ${!canUpgradeBuilding(building.id, level) ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                        title="${!canUpgradeBuilding(building.id, level) ? 'Немає необхідних передумов' : 'Покращити'}">
                    Покращити
                </button>
                ${!canUpgradeBuilding(building.id, level) ? `
                <div class="requirement-tooltip" style="
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    z-index: 1000;
                    display: none;
                    border: 1px solid #1fa2c7;
                    min-width: 200px;
                    top: 100%;
                    left: 0;
                    margin-top: 5px;
                " id="upgrade-tooltip-${building.id}">
                    <div><strong>Потрібні передумови:</strong></div>
                    ${building.id === 'building_center' ? `<div>Рівень науки "Науковий центр": ${centerLevel}</div>` :
                      building.id === 'building_source' ? `<div>Рівень науки "Джерело": ${sourceLevel}</div>` :
                      building.id === 'building_house' ? `<div>Рівень науки "Будинок": ${getScienceLevelFromLocalStorage('building_house')}</div>` :
                      building.id === 'building_warehouse' ? `<div>Рівень науки "Склад": ${getScienceLevelFromLocalStorage('building_warehouse')}</div>` :
                      building.id === 'building_stone_quarry' ? `<div>Рівень науки "Каменярня": ${getScienceLevelFromLocalStorage('stone_quarry_science')}</div>` :
                      building.id === 'building_wood_cutter' ? `<div>Рівень науки "Лісоруб": ${getScienceLevelFromLocalStorage('wood_cutting_science')}</div>` :
                      building.id === 'building_armory' ? `<div>Рівень науки "Зброярний завод": ${getScienceLevelFromLocalStorage('building_armory')}</div>` : ''}
                </div>` : ''}
            </div>
        `;

        buildingsContainer.appendChild(buildingElement);
    });

    // Додаємо обробники для підказок покращення
    setTimeout(() => {
        buildings.forEach(building => {
            const button = document.querySelector(`#upgrade-level-${building.id}`).nextElementSibling;
            const tooltip = document.getElementById(`upgrade-tooltip-${building.id}`);

            if (tooltip) {
                button.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                });

                button.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }
            
            // Додаємо обробники для відео будівлі джерела
            if (building.id === 'building_source') {
                const videoContainer = document.getElementById(`video-container-${building.id}`);
                if (videoContainer) {
                    const video = videoContainer.querySelector('video');
                    if (video) {
                        // Завантажуємо перший кадр при відкритті
                        video.load();
                        video.muted = true; // Спочатку без звуку
                        video.play().then(() => {
                            video.pause(); // Зупиняємо на першому кадрі
                            video.currentTime = 0;
                        }).catch(() => {
                            // Ігноруємо помилки автозапуску
                        });

                        videoContainer.addEventListener('mouseenter', () => {
                            video.muted = false; // Увімкнути звук
                            video.play();
                        });

                        videoContainer.addEventListener('mouseleave', () => {
                            video.pause();
                            video.currentTime = 0; // Повертаємо відео на початок
                            video.muted = true; // Вимкнути звук
                        });
                    }
                }
            }
        });
    }, 100); // Затримка для того, щоб елементи вже були додані до DOM

    // Додаємо функцію для отримання рівня науки з localStorage
    function getScienceLevelFromLocalStorage(scienceId) {
        try {
            const savedData = localStorage.getItem('scienceLevels');
            if (savedData) {
                const levels = JSON.parse(savedData);
                return levels[scienceId] || 0;
            }
        } catch (e) {
            console.error('Помилка при отриманні рівня науки:', e);
        }
        return 0;
    }
}

// Функція для початку будівництва
async function startBuilding(buildingId, buildingName) {
    // Отримуємо кількість будівель для побудови
    const countInput = document.getElementById(`build-count-${buildingId}`);
    const count = countInput ? parseInt(countInput.value) || 1 : 1;

    try {
        // Отримуємо поточні дані будівель
        const response = await fetch('/planets/tera/buildings.json');
        let buildingsData = {};

        if (response.ok) {
            buildingsData = await response.json();
        } else {
            // Якщо файл не існує, використовуємо стандартні значення
            buildingsData = {
                building_center: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                },
                building_source: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                }
            };
        }

        // Розраховуємо час будівництва (1 будівля = 5 секунд, 10 будівель = 50 секунд)
        const constructionTime = count * 5; // 5 секунд на будівлю

        // Оновлюємо час будівництва
        buildingsData[buildingId].construction_time = Date.now() + (constructionTime * 1000);

        // Зберігаємо оновлені дані
        const saveResponse = await fetch('/api/save-buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildingsData)
        });

        if (saveResponse.ok) {
            const result = await saveResponse.json();
            console.log(result.message);

            // Показуємо таймер будівництва
            showConstructionTimer(buildingId, buildingName, count, constructionTime);

            // Запускаємо процес будівництва
            setTimeout(async () => {
                // Коли будівництво завершено, збільшуємо кількість будівель
                const finalBuildingsData = await fetch('/planets/tera/buildings.json').then(r => r.json()).catch(() => buildingsData);
                finalBuildingsData[buildingId].count += count;
                finalBuildingsData[buildingId].construction_time = 0; // Скидаємо час будівництва

                // Зберігаємо фінальні дані
                await fetch('/api/save-buildings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finalBuildingsData)
                });

                console.log(`Побудовано ${count} одиниць будівлі ${buildingName}. Загальна кількість: ${finalBuildingsData[buildingId].count}`);

                // Показуємо повідомлення про успішне будівництво
                alert(`Успішно побудовано ${count} одиниць будівлі ${buildingName}!`);

                // Оновлюємо відображення
                await loadAndRenderBuildings();
            }, constructionTime * 1000); // Час в мілісекундах
        } else {
            console.error('Помилка при збереженні даних будівель');
        }
    } catch (error) {
        console.error('Помилка при будівництві будівлі:', error);
    }
}

// Функція для відображення таймера будівництва
function showConstructionTimer(buildingId, buildingName, count, totalSeconds) {
    // Створюємо або знаходимо вікно таймера
    let timerWindow = document.getElementById('construction-timer');
    
    if (!timerWindow) {
        timerWindow = document.createElement('div');
        timerWindow.id = 'construction-timer';
        timerWindow.style.position = 'fixed';
        timerWindow.style.top = '10px';
        timerWindow.style.right = '10px';
        timerWindow.style.background = '#0e3a47';
        timerWindow.style.border = '2px solid #1fa2c7';
        timerWindow.style.borderRadius = '4px';
        timerWindow.style.padding = '10px';
        timerWindow.style.zIndex = '1000';
        timerWindow.style.color = 'white';
        timerWindow.style.fontFamily = 'monospace';
        timerWindow.style.minWidth = '200px';
        timerWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
        timerWindow.innerHTML = '<div class="timer-title">⏱️ Процес будівництва</div><div id="timer-content"></div>';
        document.body.appendChild(timerWindow);
    }

    // Оновлюємо вміст таймера
    const timerContent = document.getElementById('timer-content');
    timerContent.innerHTML = `
        <div>Будується: ${buildingName} (${count} шт.)</div>
        <div id="countdown-${buildingId}">Час: ${totalSeconds}с</div>
        <button onclick="cancelBuilding(\'${buildingId}\')" style="
            background: #17607a;
            color: white;
            border: 1px solid #1fa2c7;
            border-radius: 4px;
            padding: 4px 8px;
            margin-top: 5px;
            cursor: pointer;
            width: 100%;
        ">Скасувати будівництво</button>
    `;

    // Запускаємо таймер
    let secondsLeft = totalSeconds;
    const countdownElement = document.getElementById(`countdown-${buildingId}`);
    
    const timerInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft >= 0) {
            countdownElement.textContent = `Час: ${secondsLeft}с`;
        } else {
            clearInterval(timerInterval);
            // Прибираємо таймер, коли час вичерпано
            if (timerWindow) {
                timerWindow.remove();
            }
        }
    }, 1000);
}

// Функція для скасування будівництва
async function cancelBuilding(buildingId) {
    try {
        // Отримуємо поточні дані будівель
        const response = await fetch('/planets/tera/buildings.json');
        let buildingsData = {};

        if (response.ok) {
            buildingsData = await response.json();
        } else {
            // Якщо файл не існує, використовуємо стандартні значення
            buildingsData = {
                building_center: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                },
                building_source: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                }
            };
        }

        // Скидаємо час будівництва
        buildingsData[buildingId].construction_time = 0;

        // Зберігаємо оновлені дані
        await fetch('/api/save-buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildingsData)
        });

        // Прибираємо вікно таймера
        const timerWindow = document.getElementById('construction-timer');
        if (timerWindow) {
            timerWindow.remove();
        }

        console.log(`Будівництво для ${buildingId} скасовано`);
    } catch (error) {
        console.error('Помилка при скасуванні будівництва:', error);
    }
}

// Функція для початку покращення рівня будівлі
async function startUpgrade(buildingId, buildingName) {
    // Отримуємо кількість рівнів для покращення
    const levelInput = document.getElementById(`upgrade-level-${buildingId}`);
    const levels = levelInput ? parseInt(levelInput.value) || 1 : 1;

    try {
        // Отримуємо поточні дані будівель
        const response = await fetch('/planets/tera/buildings.json');
        let buildingsData = {};

        if (response.ok) {
            buildingsData = await response.json();
        } else {
            // Якщо файл не існує, використовуємо стандартні значення
            buildingsData = {
                building_center: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                },
                building_source: {
                    count: 0,
                    level: 1,
                    construction_time: 0
                }
            };
        }

        // Отримуємо рівень науки науковий центр
        let centerLevel = 0;
        try {
            const savedData = localStorage.getItem('scienceLevels');
            if (savedData) {
                const levels = JSON.parse(savedData);
                centerLevel = levels.building_center || 0;
            }
        } catch (e) {
            console.error('Помилка при отриманні рівня науки наукового центру:', e);
        }

        // Перевіряємо, чи не перевищує запит на покращення рівень відповідної науки
        if (buildingId === 'building_center') {
            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > centerLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        } else if (buildingId === 'building_source') {
            // Отримуємо рівень науки джерело
            let sourceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    sourceLevel = levels.building_source || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки джерела:', e);
            }

            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > sourceLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        } else if (buildingId === 'building_stone_quarry') {
            // Отримуємо рівень науки каменярні
            let stoneQuarryScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    stoneQuarryScienceLevel = levels.stone_quarry_science || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки каменярні:', e);
            }

            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > stoneQuarryScienceLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        } else if (buildingId === 'building_wood_cutter') {
            // Отримуємо рівень науки лісоруба
            let woodCuttingScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    woodCuttingScienceLevel = levels.wood_cutting_science || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки лісоруба:', e);
            }

            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > woodCuttingScienceLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        } else if (buildingId === 'building_house') {
            // Отримуємо рівень науки будинку
            let houseScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    houseScienceLevel = levels.building_house || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки будинку:', e);
            }

            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > houseScienceLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        } else if (buildingId === 'building_warehouse') {
            // Отримуємо рівень науки складу
            let warehouseScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    warehouseScienceLevel = levels.building_warehouse || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки складу:', e);
            }

            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > warehouseScienceLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        } else if (buildingId === 'building_armory') {
            // Отримуємо рівень науки зброярного заводу
            let armoryScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    armoryScienceLevel = levels.building_armory || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки зброярного заводу:', e);
            }

            const currentLevel = buildingsData[buildingId].level;
            const targetLevel = currentLevel + levels;

            if (targetLevel > armoryScienceLevel) {
                return; // Просто виходимо, якщо умови не виконані
            }
        }

        // Розраховуємо час покращення (1 рівень = 5 секунд * кількість наявних будівель)
        const count = buildingsData[buildingId].count;
        const upgradeTime = levels * 5 * count; // 5 секунд за рівень за кожну будівлю

        // Оновлюємо час покращення
        buildingsData[buildingId].upgrade_time = Date.now() + (upgradeTime * 1000);

        // Зберігаємо оновлені дані
        const saveResponse = await fetch('/api/save-buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildingsData)
        });

        if (saveResponse.ok) {
            const result = await saveResponse.json();
            console.log(result.message);

            // Показуємо таймер покращення
            showUpgradeTimer(buildingId, buildingName, levels, upgradeTime);

            // Запускаємо процес покращення
            setTimeout(async () => {
                // Коли покращення завершено, збільшуємо рівень будівлі
                const finalBuildingsData = await fetch('/planets/tera/buildings.json').then(r => r.json()).catch(() => buildingsData);
                finalBuildingsData[buildingId].level += levels;
                finalBuildingsData[buildingId].upgrade_time = 0; // Скидаємо час покращення

                // Зберігаємо фінальні дані
                await fetch('/api/save-buildings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(finalBuildingsData)
                });

                console.log(`Покращено ${levels} рівнів будівлі ${buildingName}. Поточний рівень: ${finalBuildingsData[buildingId].level}`);

                // Оновлюємо відображення
                await loadAndRenderBuildings();
            }, upgradeTime * 1000); // Час в мілісекундах
        } else {
            console.error('Помилка при збереженні даних будівель');
        }
    } catch (error) {
        console.error('Помилка при покращенні будівлі:', error);
    }
}

// Функція для відображення таймера покращення
function showUpgradeTimer(buildingId, buildingName, levels, totalSeconds) {
    // Створюємо або знаходимо вікно таймера
    let timerWindow = document.getElementById('upgrade-timer');

    if (!timerWindow) {
        timerWindow = document.createElement('div');
        timerWindow.id = 'upgrade-timer';
        timerWindow.style.position = 'fixed';
        timerWindow.style.top = '10px';
        timerWindow.style.right = '10px';
        timerWindow.style.background = '#0e3a47';
        timerWindow.style.border = '2px solid #1fa2c7';
        timerWindow.style.borderRadius = '4px';
        timerWindow.style.padding = '10px';
        timerWindow.style.zIndex = '1000';
        timerWindow.style.color = 'white';
        timerWindow.style.fontFamily = 'monospace';
        timerWindow.style.minWidth = '200px';
        timerWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
        timerWindow.innerHTML = '<div class="timer-title">📈 Процес покращення</div><div id="upgrade-timer-content"></div>';
        document.body.appendChild(timerWindow);
    }

    // Оновлюємо вміст таймера
    const timerContent = document.getElementById('upgrade-timer-content');
    timerContent.innerHTML = `
        <div>Покращується: ${buildingName} (${levels} рівнів)</div>
        <div id="upgrade-countdown-${buildingId}">Час: ${totalSeconds}с</div>
        <button onclick="cancelUpgrade(\'${buildingId}\')" style="
            background: #17607a;
            color: white;
            border: 1px solid #1fa2c7;
            border-radius: 4px;
            padding: 4px 8px;
            margin-top: 5px;
            cursor: pointer;
            width: 100%;
        ">Скасувати покращення</button>
    `;

    // Запускаємо таймер
    let secondsLeft = totalSeconds;
    const countdownElement = document.getElementById(`upgrade-countdown-${buildingId}`);

    const timerInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft >= 0) {
            countdownElement.textContent = `Час: ${secondsLeft}с`;
        } else {
            clearInterval(timerInterval);
            // Прибираємо таймер, коли час вичерпано
            if (timerWindow) {
                timerWindow.remove();
            }
        }
    }, 1000);
}

// Функція для скасування покращення
async function cancelUpgrade(buildingId) {
    try {
        // Отримуємо поточні дані будівель
        const response = await fetch('/planets/tera/buildings.json');
        let buildingsData = {};

        if (response.ok) {
            buildingsData = await response.json();
        } else {
            // Якщо файл не існує, використовуємо стандартні значення
            buildingsData = {
                building_center: {
                    count: 0,
                    level: 1,
                    construction_time: 0,
                    upgrade_time: 0
                },
                building_source: {
                    count: 0,
                    level: 1,
                    construction_time: 0,
                    upgrade_time: 0
                }
            };
        }

        // Скидаємо час покращення
        buildingsData[buildingId].upgrade_time = 0;

        // Зберігаємо оновлені дані
        await fetch('/api/save-buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildingsData)
        });

        // Прибираємо вікно таймера
        const timerWindow = document.getElementById('upgrade-timer');
        if (timerWindow) {
            timerWindow.remove();
        }

        console.log(`Покращення для ${buildingId} скасовано`);
    } catch (error) {
        console.error('Помилка при скасуванні покращення:', error);
    }
}

// Експортуємо функцію в глобальну область
window.renderTeraWindow = renderTeraWindow;
window.startBuilding = startBuilding;
window.cancelBuilding = cancelBuilding;
window.startUpgrade = startUpgrade;
window.cancelUpgrade = cancelUpgrade;
window.updateTeraResources = updateResourcesDisplay;

// Додатково - перевіряємо, чи функція була успішно додана
console.log('Функція renderTeraWindow додана до глобального об\'єкта window');