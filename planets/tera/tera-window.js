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
                <button id="tera-production-tab-btn" style="
                    background: #17607a;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px 4px 0 0;
                    padding: 5px 10px;
                    cursor: pointer;
                ">Виробництво</button>
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
                            margin-right: 2px;
                        ">Населення</button>
                        <button id="tera-dock-res-tab-btn" style="
                            background: #17607a;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                        ">🚢 Док</button>
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
                            <div class="resources-info" id="tera-weapons-list">
                                <!-- Зброя буде відображена динамічно -->
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
                    <div id="tera-dock-res-content" style="
                        display: none;
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <div id="tera-ships-list" style="
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                                gap: 15px;
                            ">
                                <!-- Кораблі будуть відображені тут -->
                            </div>
                        </div>
                    </div>
                </div>
                <div id="tera-buildings-tab-content" style="display: none;">
                    <div id="tera-buildings-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px; max-height: 400px; overflow-y: auto; overflow-x: hidden;">
                        <!-- Будівлі будуть додані тут динамічно -->
                    </div>
                </div>
                <div id="tera-production-tab-content" style="display: none;">
                    <!-- Вкладки виробництва -->
                    <div style="display: flex; margin-bottom: 10px;">
                        <button id="tera-weapons-prod-tab-btn" style="
                            background: #1fa2c7;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                            margin-right: 2px;
                        ">Зброя</button>
                        <button id="tera-ammo-prod-tab-btn" style="
                            background: #17607a;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                            margin-right: 2px;
                        ">Боєприпаси</button>
                        <button id="tera-shipyard-prod-tab-btn" style="
                            background: #17607a;
                            color: white;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px 4px 0 0;
                            padding: 5px 10px;
                            cursor: pointer;
                        ">🚢 Суднобудування</button>
                    </div>
                    <div id="tera-weapons-prod-content" style="
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <div class="resources-info">
                                <p>🔫 Лазерна гармата: <span id="tera-weapon-laser">0</span></p>
                            </div>
                            <!-- Будівництво лазерних гармат -->
                            <div style="margin-top: 15px; padding: 10px; background: #0e3a47; border: 1px solid #1fa2c7; border-radius: 4px;">
                                <p style="margin-bottom: 10px; font-weight: bold;">🔨 Будівництво лазерної гармати</p>
                                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                    <label>
                                        <span>Рівень (1-<span id="laser-max-level">10</span>):</span>
                                        <input type="number" id="laser-build-level" min="1" value="1" style="
                                            width: 35px;
                                            background: #0e3a47;
                                            color: white;
                                            border: 1px solid #1fa2c7;
                                            border-radius: 4px;
                                            padding: 2px;
                                            font-size: 0.7em;
                                            margin-left: 5px;
                                            margin-right: 2px;
                                            -moz-appearance: textfield;
                                            text-align: center;
                                        ">
                                    </label>
                                    <button id="build-laser-btn" style="
                                        background: #17607a;
                                        color: white;
                                        border: 1px solid #1fa2c7;
                                        border-radius: 4px;
                                        padding: 4px 8px;
                                        font-size: 0.8em;
                                        cursor: pointer;
                                        width: auto;
                                        min-width: 60px;
                                        margin: 0 1px;
                                    ">Вивчити</button>
                                    <span id="laser-build-time" style="color: #aaa; font-size: 12px; margin-left: 5px;"></span>
                                </div>
                                <div id="laser-build-progress" style="
                                    margin-top: 10px;
                                    height: 20px;
                                    background: #134d5c;
                                    border: 1px solid #1fa2c7;
                                    border-radius: 4px;
                                    overflow: hidden;
                                    display: none;
                                ">
                                    <div id="laser-build-bar" style="
                                        width: 0%;
                                        height: 100%;
                                        background: linear-gradient(90deg, #1fa2c7, #2ecc71);
                                        transition: width 0.1s linear;
                                    "></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tera-ammo-prod-content" style="
                        display: none;
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <div class="resources-info">
                                <p>🔋 Енергокомірка: <span id="tera-ammo-energy">0</span></p>
                                <p>💥 Бойова голівка: <span id="tera-ammo-warhead">0</span></p>
                                <p>⚡ Плазмовий заряд: <span id="tera-ammo-plasma">0</span></p>
                            </div>
                        </div>
                    </div>
                    <div id="tera-shipyard-prod-content" style="
                        display: none;
                        padding: 10px;
                        background: #134d5c;
                        border: 1px solid #1fa2c7;
                        border-radius: 0 0 4px 4px;
                    ">
                        <div class="planet-content">
                            <!-- Будівництво кораблів -->
                            <div style="padding: 10px; background: #0e3a47; border: 1px solid #1fa2c7; border-radius: 4px;">
                                <p style="margin-bottom: 10px; font-weight: bold;">🚢 Будівництво кораблів</p>
                                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                    <label>
                                        <span>Проект:</span>
                                        <select id="ship-project-select" style="
                                            margin-left: 5px;
                                            padding: 5px;
                                            background: #134d5c;
                                            color: white;
                                            border: 1px solid #1fa2c7;
                                            border-radius: 4px;
                                            cursor: pointer;
                                            min-width: 200px;
                                        ">
                                            <option value="">-- Виберіть проект --</option>
                                        </select>
                                    </label>
                                    <label>
                                        <span>Кількість:</span>
                                        <input type="number" id="ship-build-count" min="1" value="1" style="
                                            width: 35px;
                                            background: #0e3a47;
                                            color: white;
                                            border: 1px solid #1fa2c7;
                                            border-radius: 4px;
                                            padding: 2px;
                                            font-size: 0.7em;
                                            margin-left: 5px;
                                            margin-right: 2px;
                                            -moz-appearance: textfield;
                                            text-align: center;
                                        ">
                                    </label>
                                    <button id="build-ship-btn" style="
                                        background: #17607a;
                                        color: white;
                                        border: 1px solid #1fa2c7;
                                        border-radius: 4px;
                                        padding: 4px 8px;
                                        font-size: 0.8em;
                                        cursor: pointer;
                                        width: auto;
                                        min-width: 60px;
                                        margin: 0 1px;
                                    ">Вивчити</button>
                                    <span id="ship-build-time" style="color: #aaa; font-size: 12px; margin-left: 5px;"></span>
                                </div>
                                <div id="ship-build-progress" style="
                                    margin-top: 10px;
                                    height: 20px;
                                    background: #134d5c;
                                    border: 1px solid #1fa2c7;
                                    border-radius: 4px;
                                    overflow: hidden;
                                    display: none;
                                ">
                                    <div id="ship-build-bar" style="
                                        width: 0%;
                                        height: 100%;
                                        background: linear-gradient(90deg, #1fa2c7, #2ecc71);
                                        transition: width 0.1s linear;
                                    "></div>
                                </div>
                            </div>
                        </div>
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
        productionTabContent.style.display = 'none';
        planetTabBtn.style.background = '#1fa2c7';
        buildingsTabBtn.style.background = '#17607a';
        productionTabBtn.style.background = '#17607a';

        // Оновити відображення ресурсів
        updateResourcesDisplay();
    });

    buildingsTabBtn.addEventListener('click', () => {
        planetTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'block';
        productionTabContent.style.display = 'none';
        buildingsTabBtn.style.background = '#1fa2c7';
        planetTabBtn.style.background = '#17607a';
        productionTabBtn.style.background = '#17607a';

        // Завантажити та відобразити будівлі
        loadAndRenderBuildings();
    });

    const productionTabBtn = document.getElementById('tera-production-tab-btn');
    const productionTabContent = document.getElementById('tera-production-tab-content');

    productionTabBtn.addEventListener('click', () => {
        planetTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'none';
        productionTabContent.style.display = 'block';
        planetTabBtn.style.background = '#17607a';
        buildingsTabBtn.style.background = '#17607a';
        productionTabBtn.style.background = '#1fa2c7';

        // Оновити відображення виробництва
        updateProductionDisplay();
    });

    // Додаємо обробники для вкладок ресурсів
    const basicResTabBtn = document.getElementById('tera-basic-res-tab-btn');
    const weaponsResTabBtn = document.getElementById('tera-weapons-res-tab-btn');
    const populationResTabBtn = document.getElementById('tera-population-res-tab-btn');
    const dockResTabBtn = document.getElementById('tera-dock-res-tab-btn');
    const basicResContent = document.getElementById('tera-basic-res-content');
    const weaponsResContent = document.getElementById('tera-weapons-res-content');
    const populationResContent = document.getElementById('tera-population-res-content');
    const dockResContent = document.getElementById('tera-dock-res-content');

    basicResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'block';
        weaponsResContent.style.display = 'none';
        populationResContent.style.display = 'none';
        dockResContent.style.display = 'none';
        basicResTabBtn.style.background = '#1fa2c7';
        weaponsResTabBtn.style.background = '#17607a';
        populationResTabBtn.style.background = '#17607a';
        dockResTabBtn.style.background = '#17607a';
    });

    weaponsResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'none';
        weaponsResContent.style.display = 'block';
        populationResContent.style.display = 'none';
        dockResContent.style.display = 'none';
        basicResTabBtn.style.background = '#17607a';
        weaponsResTabBtn.style.background = '#1fa2c7';
        populationResTabBtn.style.background = '#17607a';
        dockResTabBtn.style.background = '#17607a';

        // Оновити відображення зброї
        updateProductionDisplay();
    });

    populationResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'none';
        weaponsResContent.style.display = 'none';
        populationResContent.style.display = 'block';
        dockResContent.style.display = 'none';
        basicResTabBtn.style.background = '#17607a';
        weaponsResTabBtn.style.background = '#17607a';
        populationResTabBtn.style.background = '#1fa2c7';
        dockResTabBtn.style.background = '#17607a';
    });

    dockResTabBtn.addEventListener('click', () => {
        basicResContent.style.display = 'none';
        weaponsResContent.style.display = 'none';
        populationResContent.style.display = 'none';
        dockResContent.style.display = 'block';
        basicResTabBtn.style.background = '#17607a';
        weaponsResTabBtn.style.background = '#17607a';
        populationResTabBtn.style.background = '#17607a';
        dockResTabBtn.style.background = '#1fa2c7';

        // Оновити відображення кораблів
        updateDockDisplay();
    });

    // Додаємо обробники для вкладок виробництва
    const weaponsProdTabBtn = document.getElementById('tera-weapons-prod-tab-btn');
    const ammoProdTabBtn = document.getElementById('tera-ammo-prod-tab-btn');
    const shipyardProdTabBtn = document.getElementById('tera-shipyard-prod-tab-btn');
    const weaponsProdContent = document.getElementById('tera-weapons-prod-content');
    const ammoProdContent = document.getElementById('tera-ammo-prod-content');
    const shipyardProdContent = document.getElementById('tera-shipyard-prod-content');

    weaponsProdTabBtn.addEventListener('click', () => {
        weaponsProdContent.style.display = 'block';
        ammoProdContent.style.display = 'none';
        shipyardProdContent.style.display = 'none';
        weaponsProdTabBtn.style.background = '#1fa2c7';
        ammoProdTabBtn.style.background = '#17607a';
        shipyardProdTabBtn.style.background = '#17607a';

        // Оновити максимальний рівень для будівництва
        updateMaxLaserLevel();
    });

    ammoProdTabBtn.addEventListener('click', () => {
        weaponsProdContent.style.display = 'none';
        ammoProdContent.style.display = 'block';
        shipyardProdContent.style.display = 'none';
        weaponsProdTabBtn.style.background = '#17607a';
        ammoProdTabBtn.style.background = '#1fa2c7';
        shipyardProdTabBtn.style.background = '#17607a';
    });

    shipyardProdTabBtn.addEventListener('click', () => {
        weaponsProdContent.style.display = 'none';
        ammoProdContent.style.display = 'none';
        shipyardProdContent.style.display = 'block';
        weaponsProdTabBtn.style.background = '#17607a';
        ammoProdTabBtn.style.background = '#17607a';
        shipyardProdTabBtn.style.background = '#1fa2c7';

        // Завантажити список проектів
        loadShipProjects();
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

    // Додаємо обробник для кнопки будівництва лазерної гармати
    const buildLaserBtn = document.getElementById('build-laser-btn');
    if (buildLaserBtn) {
        buildLaserBtn.addEventListener('click', buildLaserWeapon);
    }

    // Додаємо обробник для кнопки будівництва корабля
    const buildShipBtn = document.getElementById('build-ship-btn');
    if (buildShipBtn) {
        buildShipBtn.addEventListener('click', buildShip);
    }

    // За замовчуванням показуємо вкладку планети
    planetTabContent.style.display = 'block';
    buildingsTabContent.style.display = 'none';
    productionTabContent.style.display = 'none';
    planetTabBtn.style.background = '#1fa2c7';
    buildingsTabBtn.style.background = '#17607a';
    productionTabBtn.style.background = '#17607a';

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

// Функція для оновлення відображення виробництва
async function updateProductionDisplay() {
    try {
        // Отримуємо дані з файлу production.json
        const response = await fetch('/planets/tera/production.json');
        let productionData = {};

        if (response.ok) {
            productionData = await response.json();
        } else {
            // Якщо файл не існує, використовуємо стандартні значення
            productionData = {
                weapons: {
                    laser: [
                        {level: 1, count: 0}, {level: 2, count: 0}, {level: 3, count: 0},
                        {level: 4, count: 0}, {level: 5, count: 0}, {level: 6, count: 0},
                        {level: 7, count: 0}, {level: 8, count: 0}, {level: 9, count: 0},
                        {level: 10, count: 0}
                    ]
                },
                ammo: {
                    energy: 0,
                    warhead: 0,
                    plasma: 0
                }
            };
        }

        // Оновлюємо значення зброї (загальна кількість для сумісності)
        if (document.getElementById('tera-weapon-laser')) {
            const totalLaser = productionData.weapons?.laser?.reduce((sum, l) => sum + (l.count || 0), 0) || 0;
            document.getElementById('tera-weapon-laser').textContent = totalLaser;
        }

        // Відображаємо тільки наявну зброю (count > 0) у вкладці "Ресурси → Зброя"
        const weaponsList = document.getElementById('tera-weapons-list');
        if (weaponsList && productionData.weapons?.laser && Array.isArray(productionData.weapons.laser)) {
            const hasAnyWeapons = productionData.weapons.laser.some(l => l.count > 0);

            if (hasAnyWeapons) {
                // Фільтруємо тільки зброю з count > 0 і сортуємо за рівнем
                const ownedWeapons = productionData.weapons.laser
                    .filter(l => l.count > 0)
                    .sort((a, b) => a.level - b.level);

                weaponsList.innerHTML = ownedWeapons.map(l =>
                    `<p style="margin-bottom: 8px;">🔫 <span style="
                        color: #1fa2c7;
                        cursor: pointer;
                        text-decoration: underline;
                    " onclick="openLaserWeaponStats(${l.level})">Лазерна гармата ${l.level}</span>: <span style="color: #4ade80; font-weight: bold;">${l.count}</span></p>`
                ).join('');
            } else {
                weaponsList.innerHTML = '<p style="color: #aaa;">Немає зброї</p>';
            }
        }

        // Оновлюємо значення боєприпасів
        if (document.getElementById('tera-ammo-energy')) {
            document.getElementById('tera-ammo-energy').textContent = productionData.ammo?.energy || 0;
        }
        if (document.getElementById('tera-ammo-warhead')) {
            document.getElementById('tera-ammo-warhead').textContent = productionData.ammo?.warhead || 0;
        }
        if (document.getElementById('tera-ammo-plasma')) {
            document.getElementById('tera-ammo-plasma').textContent = productionData.ammo?.plasma || 0;
        }
    } catch (error) {
        console.error('Помилка при отриманні даних виробництва:', error);
    }
}

// Функція для оновлення максимального рівня лазерної гармати
async function updateMaxLaserLevel() {
    const maxLevelSpan = document.getElementById('laser-max-level');
    const levelInput = document.getElementById('laser-build-level');

    if (!maxLevelSpan || !levelInput) return;

    let laserScienceLevel = 0;
    try {
        const response = await fetch('/api/science-levels');
        if (response.ok) {
            const levels = await response.json();
            laserScienceLevel = levels.weapon_laser || 0;
        } else {
            const savedData = localStorage.getItem('scienceLevels');
            if (savedData) {
                const levels = JSON.parse(savedData);
                laserScienceLevel = levels.weapon_laser || 0;
            }
        }
    } catch (e) {
        console.error('Помилка при отриманні рівня науки лазерної гармати:', e);
    }

    maxLevelSpan.textContent = laserScienceLevel;
    levelInput.max = laserScienceLevel;
}

// Функція для будівництва лазерної гармати
async function buildLaserWeapon() {
    const levelInput = document.getElementById('laser-build-level');
    const countInput = document.getElementById('laser-build-count');
    const buildTimeSpan = document.getElementById('laser-build-time');
    const progressBar = document.getElementById('laser-build-progress');
    const buildBar = document.getElementById('laser-build-bar');
    const buildBtn = document.getElementById('build-laser-btn');
    const maxLevelSpan = document.getElementById('laser-max-level');

    // Отримуємо вивчений рівень науки "Лазерна гармата" (weapon_laser) з сервера
    let laserScienceLevel = 0;
    try {
        const response = await fetch('/api/science-levels');
        if (response.ok) {
            const levels = await response.json();
            laserScienceLevel = levels.weapon_laser || 0;
            // Оновлюємо відображення максимального рівня
            if (maxLevelSpan) {
                maxLevelSpan.textContent = laserScienceLevel;
            }
        } else {
            // Резерв: беремо з localStorage
            const savedData = localStorage.getItem('scienceLevels');
            if (savedData) {
                const levels = JSON.parse(savedData);
                laserScienceLevel = levels.weapon_laser || 0;
                if (maxLevelSpan) {
                    maxLevelSpan.textContent = laserScienceLevel;
                }
            }
        }
    } catch (e) {
        console.error('Помилка при отриманні рівня науки лазерної гармати:', e);
        // Резерв: беремо з localStorage
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            const levels = JSON.parse(savedData);
            laserScienceLevel = levels.weapon_laser || 0;
            if (maxLevelSpan) {
                maxLevelSpan.textContent = laserScienceLevel;
            }
        }
    }

    const selectedLevel = parseInt(levelInput.value);
    const count = parseInt(countInput.value);

    // Перевіряємо доступний рівень
    if (selectedLevel > laserScienceLevel) {
        alert(`❌ Недостатній рівень науки! Вивчено лазерний рівень: ${laserScienceLevel}, а потрібно: ${selectedLevel}`);
        return;
    }

    if (selectedLevel < 1) {
        alert('❌ Рівень має бути не менше 1');
        return;
    }

    if (count < 1 || isNaN(count)) {
        alert('❌ Введіть коректну кількість (мінімум 1)');
        return;
    }

    // Розраховуємо час будівництва: 5с × рівень × кількість
    const timePerUnit = selectedLevel * 5 * 1000; // мс
    const totalTime = timePerUnit * count;

    // Блокуємо кнопку
    buildBtn.disabled = true;
    buildBtn.style.background = '#555';
    buildBtn.style.cursor = 'not-allowed';
    progressBar.style.display = 'block';
    buildBar.style.width = '0%';

    let startTime = Date.now();
    let remainingTime = totalTime;

    const buildInterval = setInterval(() => {
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

            // Додаємо зброю у production.json
            addLaserWeapons(selectedLevel, count);
        }
    }, 100);
}

// Функція для додавання лазерної зброї у production.json
async function addLaserWeapons(level, count) {
    try {
        const response = await fetch('/planets/tera/production.json');
        let productionData = {};

        if (response.ok) {
            productionData = await response.json();
        } else {
            productionData = {
                weapons: {
                    laser: [
                        {level: 1, count: 0}, {level: 2, count: 0}, {level: 3, count: 0},
                        {level: 4, count: 0}, {level: 5, count: 0}, {level: 6, count: 0},
                        {level: 7, count: 0}, {level: 8, count: 0}, {level: 9, count: 0},
                        {level: 10, count: 0}
                    ]
                },
                ammo: { energy: 0, warhead: 0, plasma: 0 }
            };
        }

        // Знаходимо потрібний рівень і додаємо кількість
        const laserLevel = productionData.weapons.laser.find(l => l.level === level);
        if (laserLevel) {
            laserLevel.count += count;
        }

        // Зберігаємо оновлені дані виробництва
        await fetch('/api/save-production', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productionData)
        });

        console.log(`✅ Збудовано лазерних гармат ${level} рівня: ${count} шт.`);

        // Невелика затримка перед оновленням відображення
        setTimeout(() => {
            updateProductionDisplay();
        }, 100);
    } catch (error) {
        console.error('Помилка при збереженні виробництва:', error);
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
        } else if (buildingId === 'building_engineer_center') {
            // Для покращення інженерного центру потрібен рівень науки інженерного центру
            let engineerScienceLevel = 0;
            try {
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    engineerScienceLevel = levels.building_engineer_center || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки інженерного центру:', e);
            }
            return currentLevel < engineerScienceLevel; // Можна покращити, якщо поточний рівень менше рівня науки
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
        },
        {
            id: 'building_engineer_center',
            name: 'Інженерний центр',
            icon: '⚙️'
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
        } else if (building.id === 'building_engineer_center') {
            // Отримуємо рівень науки інженерний центр
            let engineerLevel = 0;
            try {
                // Спробуємо отримати рівень науки інженерний центр з localStorage
                const savedData = localStorage.getItem('scienceLevels');
                if (savedData) {
                    const levels = JSON.parse(savedData);
                    engineerLevel = levels.building_engineer_center || 0;
                }
            } catch (e) {
                console.error('Помилка при отриманні рівня науки інженерного центру:', e);
            }
            level = Math.min(level, engineerLevel);
        }

        const buildingElement = document.createElement('div');
        buildingElement.className = 'science-section';
        buildingElement.style.cursor = 'pointer';

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
            </div>
            <div style="height: 3px;"></div>
            <div class="science-controls" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding-right: 1px;">
                <input type="number" id="build-count-${building.id}" value="1" min="1" style="
                    width: calc(100% - 70px) !important;
                    background: #0e3a47;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    padding: 2px;
                    font-size: 0.7em;
                    margin-right: 1px;
                    box-sizing: border-box;
                    -moz-appearance: textfield;
                ">
                <button class="study-btn" onclick="startBuilding('${building.id}', '${building.name}')" style="width: 68px !important; margin: 0 1px 0 0; flex-shrink: 0; min-width: 68px;">Будувати</button>
            </div>
            <div style="height: 3px;"></div>
            <div class="science-controls" style="display: flex; align-items: center; width: 100%; box-sizing: border-box; padding-right: 1px;">
                <input type="number" id="upgrade-level-${building.id}" value="1" min="1" style="
                    width: calc(100% - 70px) !important;
                    background: #0e3a47;
                    color: white;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    padding: 2px;
                    font-size: 0.7em;
                    margin-right: 1px;
                    box-sizing: border-box;
                    -moz-appearance: textfield;
                " ${!canUpgradeBuilding(building.id, level) ? 'disabled' : ''}>
                <button class="study-btn"
                        onclick="startUpgrade('${building.id}', '${building.name}')"
                        ${!canUpgradeBuilding(building.id, level) ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                        title="${!canUpgradeBuilding(building.id, level) ? 'Немає необхідних передумов' : 'Покращити'}"
                        style="width: 68px !important; margin: 0 1px 0 0; flex-shrink: 0; min-width: 68px;">
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

    // Додаємо обробники для підказок покра����ення
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
        console.error('Помилка при будівництві б��дівлі:', error);
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

        // Скидаємо час будівниц��ва
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
            console.error('Помилка при отриманні рівня на��ки наукового центру:', e);
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
                return; // Просто виходим��, якщо умови не в��конані
            }
        } else if (buildingId === 'building_stone_quarry') {
            // Отримуємо рівень науки кам��ня��ні
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

        console.log(`П��кра��ення для ${buildingId} скасовано`);
    } catch (error) {
        console.error('Помилка при скасуванні покращення:', error);
    }
}


// Експортуємо функції в глобальну область
window.renderTeraWindow = renderTeraWindow;
window.startBuilding = startBuilding;
window.cancelBuilding = cancelBuilding;
window.startUpgrade = startUpgrade;
window.cancelUpgrade = cancelUpgrade;
window.updateTeraResources = updateResourcesDisplay;
window.openLaserWeaponStats = openLaserWeaponStats;
