// Динамічне створення вікна наук

import { sciences } from './science-data.js';
import { checkScienceRequirements } from './science-dependencies.js';

function renderScienceBlocks() {
    // Мапа SVG-фонів для заголовків наук
    const scienceHeaderImages = {
        'physics': 'physics-header.svg',
        'chemistry': 'chemistry-header.svg',
        'biology': 'biology-header.svg',
        'geology': 'geology-header.svg',
        'hydrogeology': 'hydrogeology-header.svg',
        'geometry': 'geometry-header.svg',
        'astronomy': 'astronomy-header.svg',
        'materials': 'materials-header.svg',
        'construction': 'construction-header.svg',
        'dendrology': 'dendrology-header.svg',
        'forestry': 'forestry-header.svg',
        'petrology': 'petrology-header.svg',
        'stonework': 'stonework-header.svg',
        'stone_quarry_science': 'stone-quarry-science-header.svg',
        'wood_cutting_science': 'wood-cutting-science-header.svg',
        'building_house': 'building-house-header.svg',
        'building_warehouse': 'building-warehouse-header.svg',
        'building_engineer_center': 'building-engineer-center-header.svg'
    };
    
    // Мапа анімованих SVG для всіх наук
    const scienceAnimatedImages = {
        'physics': 'physics.svg',
        'chemistry': 'chemistry.svg',
        'biology': 'biology.svg',
        'geology': 'geology.svg',
        'hydrogeology': 'hydrogeology.svg',
        'geometry': 'geometry.svg',
        'astronomy': 'astronomy.svg',
        'materials': 'materials.svg',
        'construction': 'construction.svg',
        'dendrology': 'dendrology.svg',
        'forestry': 'forestry.svg',
        'petrology': 'petrology.svg',
        'stonework': 'stonework.svg',
        'stone_quarry_science': 'stone-quarry-science.svg',
        'wood_cutting_science': 'wood-cutting-science.svg',
        'building_house': 'building-house.svg',
        'building_warehouse': 'building-warehouse.svg',
        'building_engineer_center': 'building-engineer-center.svg',
        'weapon_laser': 'weapon-laser.svg',
        'weapon_missile': 'weapon-missile.svg',
        'ship_fighter': 'ship-fighter.svg',
        'ship_cruiser': 'ship-cruiser.svg'
    };
    
    // Функція для отримання стилю заголовка
    function getHeaderStyle(scienceId) {
        const headerImage = scienceHeaderImages[scienceId];
        const animatedImage = scienceAnimatedImages[scienceId];
        return {
            headerStyle: headerImage ? `background: url('images/${headerImage}') no-repeat center center; background-size: cover; color: #ffffff; text-shadow: 0 0 5px rgba(78, 197, 255, 0.5); display: flex; align-items: center; justify-content: center; min-height: 39px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 5px; font-size: 0.7em; font-weight: bold;` : '',
            animatedImage: animatedImage
        };
    }

    // Отримуємо або створюємо вікно наук
    let scienceWindow = document.getElementById('science-main-window');

    if (!scienceWindow) {
        scienceWindow = document.createElement('div');
        scienceWindow.id = 'science-main-window';
        scienceWindow.className = 'science-details-window';
        scienceWindow.innerHTML = `
            <button class="science-close-btn">✕</button>
            <div class="science-details-header"></div>
            <div id="science-level-display" style="
                position: absolute;
                top: 5px;
                left: 5px;
                background: #17607a;
                border: 1px solid #1fa2c7;
                border-radius: 4px;
                padding: 4px 8px;
                color: white;
                font-size: 0.8em;
                z-index: 201;
                display: none;
            "></div>
            <div class="science-details-content"></div>
        `;
        document.body.appendChild(scienceWindow);
    }

    // Показуємо вікно
    scienceWindow.style.display = 'block';
    window.windowManager?.update('science-main-window', true);
    bringWindowToFront(scienceWindow);

    // Оновлюємо заголовок
    const header = scienceWindow.querySelector('.science-details-header');
    header.innerHTML = `<div class="science-details-title" style="text-align: center; justify-content: center; display: flex; align-items: center; gap: 8px;"><img src="images/flask_32x32.png" alt="Наука" style="width: 28px; height: 28px;">Наука</div>`;

    // Оновлюємо вміст
    const content = scienceWindow.querySelector('.science-details-content');

    // Створюємо HTML для вкладок
    const tabsHtml = `
        <div style="display: flex; margin-bottom: 10px;">
            <button id="basic-tab-btn" style="
                background: #1fa2c7;
                color: white;
                border: 1px solid #1fa2c7;
                border-radius: 4px 4px 0 0;
                padding: 5px 10px;
                cursor: pointer;
                margin-right: 2px;
            ">Базова</button>
            <button id="buildings-tab-btn" style="
                background: #17607a;
                color: white;
                border: 1px solid #1fa2c7;
                border-radius: 4px 4px 0 0;
                padding: 5px 10px;
                cursor: pointer;
                margin-right: 2px;
            ">Будівлі</button>
            <button id="weapons-tab-btn" style="
                background: #17607a;
                color: white;
                border: 1px solid #1fa2c7;
                border-radius: 4px 4px 0 0;
                padding: 5px 10px;
                cursor: pointer;
                margin-right: 2px;
            ">Озброєння</button>
            <button id="ships-tab-btn" style="
                background: #17607a;
                color: white;
                border: 1px solid #1fa2c7;
                border-radius: 4px 4px 0 0;
                padding: 5px 10px;
                cursor: pointer;
            ">Кораблі</button>
        </div>
        <div id="tabs-content" style="
            padding: 10px;
            background: #0e3a47;
            border: 2px solid #1fa2c7;
            border-radius: 0 0 4px 4px;
            min-height: 200px;
        ">
            <div id="basic-tab-content" style="display: block;">
                <div id="science-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
    `;

    // Отримуємо поточні рівні всіх наук
    const scienceLevels = {};
    sciences.forEach(science => {
        scienceLevels[science.id] = window.scienceDataManager ? window.scienceDataManager.getScienceLevel(science.id) : 0;
    });

    // Отримуємо рівні для озброєння та кораблів
    const weaponLaserLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('weapon_laser') : 0;
    const weaponMissileLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('weapon_missile') : 0;
    const shipFighterLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('ship_fighter') : 0;
    const shipCruiserLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('ship_cruiser') : 0;

    // Отримуємо стилі для зброї та кораблів
    const weaponLaserStyles = getHeaderStyle('weapon_laser');
    const weaponMissileStyles = getHeaderStyle('weapon_missile');
    const shipFighterStyles = getHeaderStyle('ship_fighter');
    const shipCruiserStyles = getHeaderStyle('ship_cruiser');

    // Створюємо HTML для наук
    let sciencesHtml = '';
    sciences.forEach(science => {
        // Отримуємо поточний рівень науки
        const currentLevel = scienceLevels[science.id];

        // Перевіряємо вимоги для наступного рівня
        const nextLevel = currentLevel + 1;
        const requirements = checkScienceRequirements(science.id, nextLevel, scienceLevels);

        // Визначаємо, чи можна вивчати науку
        const canStudy = requirements.fulfilled;

        // Пропускаємо будівлі, оскільки вони будуть в окремій вкладці
        if (science.id.startsWith('building_') &&
            (science.id === 'building_house' || science.id === 'building_warehouse')) {
            return; // Пропускаємо цю ітерацію для будівель в основній вкладці
        }

        // Отримуємо стилі для заголовка
        const headerStyleData = getHeaderStyle(science.id);
        const headerStyle = headerStyleData.headerStyle;
        const animatedImage = headerStyleData.animatedImage;

        sciencesHtml += `
                    <div class="science-section" style="cursor: pointer; position: relative;" data-science="${science.id}">
                        <div class="science-block-title" style="${headerStyle}">
                            ${science.name}
                        </div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="level-indicator-${science.id}">${currentLevel}</div>
                        ${animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${animatedImage}" alt="${science.name}" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="level-${science.id}" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudy('${science.id}', '${JSON.stringify(science).replace(/"/g, '&quot;')}')"
                                    ${canStudy ? '' : 'disabled'}
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0; ${canStudy ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                                Вивчити
                            </button>
                            ${!canStudy ? `
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
                            " id="tooltip-${science.id}">
                                <div><strong>Потрібні передумови:</strong></div>
                                ${requirements.requirements.map(req =>
                                    `<div>${req.science}: ${req.current}/${req.required}</div>`
                                ).join('')}
                            </div>` : ''}
                        </div>
                    </div>
        `;
    });

    // Отримуємо рівні будівель
    const centerLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('building_center') : 0;
    const sourceLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('building_source') : 0;
    const houseLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('building_house') : 0;
    const warehouseLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('building_warehouse') : 0;
    const stoneQuarryLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('building_stone_quarry') : 0;
    const woodCutterLevel = window.scienceDataManager ? window.scienceDataManager.getScienceLevel('building_wood_cutter') : 0;

    // Перевіряємо залежності для будівель
    const allLevels = window.scienceDataManager ? window.scienceDataManager.getAllScienceLevels() : {};

    // Для наукового центру: потрібен 1 рівень будівництва на кожні 2 рівні наукового центру
    const nextCenterLevel = centerLevel + 1;
    const requiredCenterConstruction = Math.ceil(nextCenterLevel / 2);
    const canStudyCenter = allLevels.construction >= requiredCenterConstruction;

    const nextSourceLevel = sourceLevel + 1;
    // Для джерела потрібно 1 рівень гідрогеології на кожні 2 рівні джерела
    const requiredSourceHydrogeology = Math.ceil(nextSourceLevel / 2);
    const canStudySource = allLevels.hydrogeology >= requiredSourceHydrogeology;

    // Для будинку: потрібен 1 рівень будівництва на кожні 3 рівні будинку
    const nextHouseLevel = houseLevel + 1;
    const requiredHouseConstruction = Math.ceil(nextHouseLevel / 3);
    const canStudyHouse = allLevels.construction >= requiredHouseConstruction;

    // Для складу: потрібен 1 рівень будівництва на кожні 2 рівні складу
    const nextWarehouseLevel = warehouseLevel + 1;
    const requiredWarehouseConstruction = Math.ceil(nextWarehouseLevel / 2);
    const canStudyWarehouse = allLevels.construction >= requiredWarehouseConstruction;

    // Отримуємо стилі для будівель
    const centerStyles = getHeaderStyle('building_engineer_center');
    const sourceStyles = getHeaderStyle('hydrogeology');
    const houseStyles = getHeaderStyle('building_house');
    const warehouseStyles = getHeaderStyle('building_warehouse');
    const stoneQuarryStyles = getHeaderStyle('stone_quarry_science');
    const woodCutterStyles = getHeaderStyle('wood_cutting_science');

    const buildingsHtml = `
                </div>
            </div>
            <div id="buildings-tab-content" style="display: none;">
                <div id="buildings-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${centerStyles.headerStyle}">Інженерний центр</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="building-level-center-indicator">${centerLevel}</div>
                        ${centerStyles.animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${centerStyles.animatedImage}" alt="Інженерний центр" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="building-level-center" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('center', 'Науковий центр')"
                                    ${canStudyCenter ? '' : 'disabled'}
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0; ${canStudyCenter ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                                Вивчити
                            </button>
                            ${!canStudyCenter ? `
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
                            " id="tooltip-building-center">
                                <div><strong>Потрібні передумови:</strong></div>
                                <div>Будівництво: ${allLevels.construction}/${requiredCenterConstruction}</div>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${sourceStyles.headerStyle}">Джерело</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="building-level-source-indicator">${sourceLevel}</div>
                        ${sourceStyles.animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${sourceStyles.animatedImage}" alt="Джерело" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="building-level-source" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('source', 'Джерело')"
                                    ${canStudySource ? '' : 'disabled'}
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0; ${canStudySource ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                                Вивчити
                            </button>
                            ${!canStudySource ? `
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
                            " id="tooltip-building-source">
                                <div><strong>Потрібні передумови:</strong></div>
                                <div>Гідрогеологія: ${allLevels.hydrogeology}/${requiredSourceHydrogeology}</div>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${houseStyles.headerStyle}">Будинок</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="building-level-house-indicator">${houseLevel}</div>
                        ${houseStyles.animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${houseStyles.animatedImage}" alt="Будинок" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="building-level-house" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('house', 'Будинок')"
                                    ${canStudyHouse ? '' : 'disabled'}
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0; ${canStudyHouse ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                                Вивчити
                            </button>
                            ${!canStudyHouse ? `
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
                            " id="tooltip-building-house">
                                <div><strong>Потрібні передумови:</strong></div>
                                <div>Будівництво: ${allLevels.construction}/${requiredHouseConstruction}</div>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${warehouseStyles.headerStyle}">Склад</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="building-level-warehouse-indicator">${warehouseLevel}</div>
                        ${warehouseStyles.animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${warehouseStyles.animatedImage}" alt="Склад" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="building-level-warehouse" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('warehouse', 'Склад')"
                                    ${canStudyWarehouse ? '' : 'disabled'}
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0; ${canStudyWarehouse ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                                Вивчити
                            </button>
                            ${!canStudyWarehouse ? `
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
                            " id="tooltip-building-warehouse">
                                <div><strong>Потрібні передумови:</strong></div>
                                <div>Будівництво: ${allLevels.construction}/${requiredWarehouseConstruction}</div>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${stoneQuarryStyles.headerStyle}">Каменярня</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="building-level-stone-quarry-indicator">${stoneQuarryLevel}</div>
                        ${stoneQuarryStyles.animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${stoneQuarryStyles.animatedImage}" alt="Каменярня" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="building-level-stone-quarry" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('stone_quarry', 'Каменярня')"
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0;">
                                Вивчити
                            </button>
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${woodCutterStyles.headerStyle}">Лісоруб</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="building-level-wood-cutter-indicator">${woodCutterLevel}</div>
                        ${woodCutterStyles.animatedImage ? `
                        <div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="images/${woodCutterStyles.animatedImage}" alt="Лісоруб" style="width: 70px; height: 70px; object-fit: contain;" />
                        </div>
                        ` : ''}
                        <div class="science-controls">
                            <input type="number" id="building-level-wood-cutter" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('wood_cutter', 'Лісоруб')"
                                    style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0;">
                                Вивчити
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="weapons-tab-content" style="display: none;">
                <div id="weapons-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${weaponLaserStyles.headerStyle}">Лазерна гармата</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="weapon-laser-level">${weaponLaserLevel}</div>
                        ${weaponLaserStyles.animatedImage ? `<div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;"><img src="images/${weaponLaserStyles.animatedImage}" alt="Лазерна гармата" style="width: 70px; height: 70px; object-fit: contain;" /></div>` : ''}
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="weapon-laser-count" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForWeapon('laser', 'Лазерна гармата')" style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0;">Вивчити</button>
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${weaponMissileStyles.headerStyle}">Ракетна установка</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="weapon-missile-level">${weaponMissileLevel}</div>
                        ${weaponMissileStyles.animatedImage ? `<div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;"><img src="images/${weaponMissileStyles.animatedImage}" alt="Ракетна установка" style="width: 70px; height: 70px; object-fit: contain;" /></div>` : ''}
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="weapon-missile-count" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForWeapon('missile', 'Ракетна установка')" style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0;">Вивчити</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="ships-tab-content" style="display: none;">
                <div id="ships-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${shipFighterStyles.headerStyle}">Винищувач</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="ship-fighter-level">${shipFighterLevel}</div>
                        ${shipFighterStyles.animatedImage ? `<div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;"><img src="images/${shipFighterStyles.animatedImage}" alt="Винищувач" style="width: 70px; height: 70px; object-fit: contain;" /></div>` : ''}
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="ship-fighter-count" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForShip('fighter', 'Винищувач')" style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0;">Вивчити</button>
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title" style="${shipCruiserStyles.headerStyle}">Крейсер</div>
                        <div class="science-level-indicator" style="
                            position: absolute;
                            top: 40px;
                            left: 1px;
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px;
                            color: white;
                            font-size: 0.6em;
                            text-align: center;
                            z-index: 10;
                        " id="ship-cruiser-level">${shipCruiserLevel}</div>
                        ${shipCruiserStyles.animatedImage ? `<div style="padding: 2px 0; display: flex; justify-content: center; align-items: center; flex: 1;"><img src="images/${shipCruiserStyles.animatedImage}" alt="Крейсер" style="width: 70px; height: 70px; object-fit: contain;" /></div>` : ''}
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="ship-cruiser-count" value="1" min="1" style="
                                width: 50px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin: 0;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForShip('cruiser', 'Крейсер')" style="padding: 2px 4px; font-size: 0.7em; height: 18px; white-space: nowrap; width: 54px; margin: 0;">Вивчити</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

// Змінна для зберігання активної вкладки
let activeScienceTab = 'basic';

// Встановлюємо вміст вікна
    content.innerHTML = tabsHtml + sciencesHtml + buildingsHtml;

    // Додаємо обробники для вкладок
    const basicTabBtn = document.getElementById('basic-tab-btn');
    const buildingsTabBtn = document.getElementById('buildings-tab-btn');
    const weaponsTabBtn = document.getElementById('weapons-tab-btn');
    const shipsTabBtn = document.getElementById('ships-tab-btn');
    const basicTabContent = document.getElementById('basic-tab-content');
    const buildingsTabContent = document.getElementById('buildings-tab-content');
    const weaponsTabContent = document.getElementById('weapons-tab-content');
    const shipsTabContent = document.getElementById('ships-tab-content');

    basicTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'block';
        buildingsTabContent.style.display = 'none';
        weaponsTabContent.style.display = 'none';
        shipsTabContent.style.display = 'none';
        basicTabBtn.style.background = '#1fa2c7';
        buildingsTabBtn.style.background = '#17607a';
        weaponsTabBtn.style.background = '#17607a';
        shipsTabBtn.style.background = '#17607a';
        activeScienceTab = 'basic';
    });

    buildingsTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'block';
        weaponsTabContent.style.display = 'none';
        shipsTabContent.style.display = 'none';
        basicTabBtn.style.background = '#17607a';
        buildingsTabBtn.style.background = '#1fa2c7';
        weaponsTabBtn.style.background = '#17607a';
        shipsTabBtn.style.background = '#17607a';
        activeScienceTab = 'buildings';
    });

    weaponsTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'none';
        weaponsTabContent.style.display = 'block';
        shipsTabContent.style.display = 'none';
        basicTabBtn.style.background = '#17607a';
        buildingsTabBtn.style.background = '#17607a';
        weaponsTabBtn.style.background = '#1fa2c7';
        shipsTabBtn.style.background = '#17607a';
        activeScienceTab = 'weapons';
    });

    shipsTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'none';
        weaponsTabContent.style.display = 'none';
        shipsTabContent.style.display = 'block';
        basicTabBtn.style.background = '#17607a';
        buildingsTabBtn.style.background = '#17607a';
        weaponsTabBtn.style.background = '#17607a';
        shipsTabBtn.style.background = '#1fa2c7';
        activeScienceTab = 'ships';
    });

    // Додаємо обробники для підказок
    sciences.forEach(science => {
        if (!science.id.startsWith('building_') || 
            (science.id !== 'building_house' && science.id !== 'building_warehouse')) {
            const button = document.querySelector(`#level-${science.id}`).nextElementSibling;
            const tooltip = document.getElementById(`tooltip-${science.id}`);

            if (tooltip) {
                button.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                });

                button.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }
        }
    });

    // Додаємо обробники для підказок будівель
    const centerButton = document.querySelector('#building-level-center').nextElementSibling;
    const centerTooltip = document.getElementById('tooltip-building-center');
    if (centerTooltip) {
        centerButton.addEventListener('mouseenter', () => {
            centerTooltip.style.display = 'block';
        });

        centerButton.addEventListener('mouseleave', () => {
            centerTooltip.style.display = 'none';
        });
    }

    const sourceButton = document.querySelector('#building-level-source').nextElementSibling;
    const sourceTooltip = document.getElementById('tooltip-building-source');
    if (sourceTooltip) {
        sourceButton.addEventListener('mouseenter', () => {
            sourceTooltip.style.display = 'block';
        });

        sourceButton.addEventListener('mouseleave', () => {
            sourceTooltip.style.display = 'none';
        });
    }

    const houseButton = document.querySelector('#building-level-house').nextElementSibling;
    const houseTooltip = document.getElementById('tooltip-building-house');
    if (houseTooltip) {
        houseButton.addEventListener('mouseenter', () => {
            houseTooltip.style.display = 'block';
        });

        houseButton.addEventListener('mouseleave', () => {
            houseTooltip.style.display = 'none';
        });
    }

    const warehouseButton = document.querySelector('#building-level-warehouse').nextElementSibling;
    const warehouseTooltip = document.getElementById('tooltip-building-warehouse');
    if (warehouseTooltip) {
        warehouseButton.addEventListener('mouseenter', () => {
            warehouseTooltip.style.display = 'block';
        });

        warehouseButton.addEventListener('mouseleave', () => {
            warehouseTooltip.style.display = 'none';
        });
    }

    // Функція для початку вивчення науки
    window.startStudy = function(scienceId, scienceObjStr) {
        // Розпарсюємо об'єкт науки
        const scienceObj = JSON.parse(scienceObjStr.replace(/&quot;/g, '"'));

        // Отримуємо поточний рівень науки
        const currentLevel = window.scienceDataManager.getScienceLevel(scienceId);
        const nextLevel = currentLevel + 1; // Наступний рівень для вивчення

        // Отримуємо всі рівні наук для перевірки залежностей
        const scienceLevels = window.scienceDataManager.getAllScienceLevels();

        // Перевіряємо залежності для наступного рівня науки
        const requirements = checkScienceRequirements(scienceId, nextLevel, scienceLevels);

        // Якщо вимоги не виконані, не дозволяємо почати вивчення
        if (!requirements.fulfilled) {
            return; // Просто виходимо, якщо умови не виконані
        }

        // Викликаємо серверний метод для початку вивчення
        startStudyOnServer(scienceId, nextLevel, scienceObj);
    };

    // Функція для початку вивчення будівлі (науки)
    window.startStudyForBuilding = function(buildingId, buildingName) {
        // Отримуємо поточний рівень будівлі
        const currentLevel = window.scienceDataManager.getScienceLevel(`building_${buildingId}`);
        const nextLevel = currentLevel + 1; // Наступний рівень для вивчення

        // Отримуємо всі рівні наук для перевірки залежностей
        const scienceLevels = window.scienceDataManager.getAllScienceLevels();

        // Перевіряємо залежності для наступного рівня будівлі
        const buildingIdFull = `building_${buildingId}`;

        // Логіка перевірки залежностей для будівель
        let requirements = {
            fulfilled: true,
            requirements: []
        };

        if (buildingIdFull === 'building_center') {
            // Для вивчення наукового центру: потрібен 1 рівень будівництва на кожні 2 рівні наукового центру
            const requiredConstructionLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.construction >= requiredConstructionLevel,
                requirements: [
                    { science: 'Будівництво', current: scienceLevels.construction, required: requiredConstructionLevel }
                ]
            };
        } else if (buildingIdFull === 'building_source') {
            // Для вивчення джерела: потрібно 1 рівень гідрогеології на кожні 2 рівні джерела
            const requiredHydrogeologyLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.hydrogeology >= requiredHydrogeologyLevel,
                requirements: [
                    { science: 'Гідрогеологія', current: scienceLevels.hydrogeology, required: requiredHydrogeologyLevel }
                ]
            };
        } else if (buildingIdFull === 'building_house') {
            // Для вивчення будинку: потрібен 1 рівень будівництва на кожні 3 рівні будинку
            const requiredConstructionLevel = Math.ceil(nextLevel / 3);
            requirements = {
                fulfilled: scienceLevels.construction >= requiredConstructionLevel,
                requirements: [
                    { science: 'Будівництво', current: scienceLevels.construction, required: requiredConstructionLevel }
                ]
            };
        } else if (buildingIdFull === 'building_warehouse') {
            // Для вивчення складу: потрібен 1 рівень будівництва на кожні 2 рівні складу
            const requiredConstructionLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.construction >= requiredConstructionLevel,
                requirements: [
                    { science: 'Будівництво', current: scienceLevels.construction, required: requiredConstructionLevel }
                ]
            };
        }

        // Якщо вимоги не виконані, не дозволяємо почати вивчення
        if (!requirements.fulfilled) {
            return; // Просто виходимо, якщо умови не виконані
        }

        // Створюємо об'єкт будівлі для відображення
        const buildingObj = {
            id: `building_${buildingId}`,
            name: buildingName,
            icon: buildingId === 'center' ? '🔬' : 
                  buildingId === 'source' ? '💧' : 
                  buildingId === 'house' ? '🏠' : 
                  buildingId === 'warehouse' ? '📦' : 
                  buildingId === 'stone_quarry' ? '🪨' : '🪵'
        };

        // Викликаємо серверний метод для початку вивчення
        startStudyOnServer(`building_${buildingId}`, nextLevel, buildingObj);
    };

    // Функція для початку вивчення озброєння
    window.startStudyForWeapon = function(weaponId, weaponName) {
        // Отримуємо поточний рівень озброєння
        const currentLevel = window.scienceDataManager.getScienceLevel(`weapon_${weaponId}`);
        const nextLevel = currentLevel + 1;

        // Отримуємо всі рівні наук для перевірки залежностей
        const scienceLevels = window.scienceDataManager.getAllScienceLevels();

        // Перевіряємо залежності для наступного рівня озброєння
        let requirements = {
            fulfilled: true,
            requirements: []
        };

        if (weaponId === 'laser') {
            // Для вивчення лазерної гармати: потрібен 1 рівень фізики на кожні 2 рівні зброї
            const requiredPhysicsLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.physics >= requiredPhysicsLevel,
                requirements: [
                    { science: 'Фізика', current: scienceLevels.physics, required: requiredPhysicsLevel }
                ]
            };
        } else if (weaponId === 'missile') {
            // Для вивчення ракетної установки: потрібен 1 рівень хімії на кожні 2 рівні зброї
            const requiredChemistryLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.chemistry >= requiredChemistryLevel,
                requirements: [
                    { science: 'Хімія', current: scienceLevels.chemistry, required: requiredChemistryLevel }
                ]
            };
        }

        // Якщо вимоги не виконані, не дозволяємо почати вивчення
        if (!requirements.fulfilled) {
            alert(`Недостатньо рівня науки!\n${requirements.requirements.map(r => `${r.science}: ${r.current}/${r.required}`).join('\n')}`);
            return;
        }

        // Створюємо об'єкт озброєння для відображення
        const weaponObj = {
            id: `weapon_${weaponId}`,
            name: weaponName,
            icon: weaponId === 'laser' ? '🔫' : '🚀'
        };

        // Викликаємо серверний метод для початку вивчення
        startStudyOnServer(`weapon_${weaponId}`, nextLevel, weaponObj);
    };

    // Функція для початку вивчення корабля
    window.startStudyForShip = function(shipId, shipName) {
        // Отримуємо поточний рівень корабля
        const currentLevel = window.scienceDataManager.getScienceLevel(`ship_${shipId}`);
        const nextLevel = currentLevel + 1;

        // Отримуємо всі рівні наук для перевірки залежностей
        const scienceLevels = window.scienceDataManager.getAllScienceLevels();

        // Перевіряємо залежності для наступного рівня корабля
        let requirements = {
            fulfilled: true,
            requirements: []
        };

        if (shipId === 'fighter') {
            // Для вивчення винищувача: потрібен 1 рівень фізики на кожні 2 рівні корабля
            const requiredPhysicsLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.physics >= requiredPhysicsLevel,
                requirements: [
                    { science: 'Фізика', current: scienceLevels.physics, required: requiredPhysicsLevel }
                ]
            };
        } else if (shipId === 'cruiser') {
            // Для вивчення крейсера: потрібен 1 рівень фізики та 1 рівень хімії на кожні 2 рівні корабля
            const requiredPhysicsLevel = Math.ceil(nextLevel / 2);
            const requiredChemistryLevel = Math.ceil(nextLevel / 2);
            requirements = {
                fulfilled: scienceLevels.physics >= requiredPhysicsLevel && scienceLevels.chemistry >= requiredChemistryLevel,
                requirements: [
                    { science: 'Фізика', current: scienceLevels.physics, required: requiredPhysicsLevel },
                    { science: 'Хімія', current: scienceLevels.chemistry, required: requiredChemistryLevel }
                ]
            };
        }

        // Якщо вимоги не виконані, не дозволяємо почати вивчення
        if (!requirements.fulfilled) {
            alert(`Недостатньо рівня науки!\n${requirements.requirements.map(r => `${r.science}: ${r.current}/${r.required}`).join('\n')}`);
            return;
        }

        // Створюємо об'єкт корабля для відображення
        const shipObj = {
            id: `ship_${shipId}`,
            name: shipName,
            icon: shipId === 'fighter' ? '✈️' : '🚀'
        };

        // Викликаємо серверний метод для початку вивчення
        startStudyOnServer(`ship_${shipId}`, nextLevel, shipObj);
    };

    // Додаємо обробник для кнопки закриття
    const closeBtn = scienceWindow.querySelector('.science-close-btn');
    closeBtn.onclick = () => {
        window.windowManager?.update('science-main-window', false);
        scienceWindow.style.display = 'none';
    };

    // Додаємо можливість перетягування
    if (typeof window.makeDraggable === 'function') {
        window.makeDraggable(scienceWindow, '.science-details-header');
    } else {
        console.warn('makeDraggable function not found for science-main-window.');
    }
}

// Функція для виклику серверного методу початку вивчення
function startStudyOnServer(scienceId, level, scienceObj) {
    // Відправляємо запит на сервер для початку вивчення
    fetch('/api/start-study', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            scienceId: scienceId,
            level: level
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Вивчення науки ${scienceObj.name} рівня ${level} розпочато`);

            // Показуємо таймер вивчення
            showStudyTimer(scienceObj, level, data.estimatedTime);
        } else {
            console.error('Помилка при початку вивчення:', data.message);
        }
    })
    .catch(error => {
        console.error('Помилка при відправленні запиту на сервер:', error);
    });
}

// Функція для відображення таймера вивчення
function showStudyTimer(scienceObj, level, estimatedTime) {
    // Створюємо або знаходимо вікно таймера
    let timerWindow = document.getElementById('study-timer');

    if (!timerWindow) {
        timerWindow = document.createElement('div');
        timerWindow.id = 'study-timer';
        timerWindow.style.position = 'fixed';
        timerWindow.style.top = '10px';
        timerWindow.style.left = '50%';
        timerWindow.style.transform = 'translateX(-50%)';
        timerWindow.style.background = '#0e3a47';
        timerWindow.style.border = '2px solid #1fa2c7';
        timerWindow.style.borderRadius = '4px';
        timerWindow.style.padding = '5px 10px';
        timerWindow.style.zIndex = '99999';
        timerWindow.style.color = 'white';
        timerWindow.style.fontFamily = 'monospace';
        timerWindow.style.minWidth = '250px';
        timerWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
        timerWindow.innerHTML = '<div id="timer-content"></div>';
        document.body.appendChild(timerWindow);
    }

    // Оновлюємо вміст таймера
    const timerContent = document.getElementById('timer-content');
    const scienceName = scienceObj.name || 'Наука';
    timerContent.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
            <img src="images/flask_32x32.png" alt="Наука" style="width: 32px; height: 32px; cursor: pointer;" onclick="window.renderScienceBlocks && window.renderScienceBlocks()">
            <div style="background: #0e3a47; border: 1px solid #1fa2c7; padding: 5px 10px; border-radius: 4px; min-width: 150px; text-align: center;">${scienceName} (рівень ${level})</div>
            <div id="countdown-${scienceObj.id}" style="background: #0e3a47; border: 1px solid #1fa2c7; padding: 5px 10px; border-radius: 4px; min-width: 80px; text-align: center;">${estimatedTime}с</div>
        </div>
    `;

    // Запускаємо таймер
    let secondsLeft = estimatedTime;
    const countdownElement = document.getElementById(`countdown-${scienceObj.id}`);

    const timerInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft >= 0) {
            const hours = Math.floor(secondsLeft / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0');
            const seconds = (secondsLeft % 60).toString().padStart(2, '0');
            if (countdownElement) {
                countdownElement.textContent = `${hours}:${minutes}:${seconds}`;
            }
        } else {
            clearInterval(timerInterval);
            // Прибираємо таймер, коли час вичерпано
            if (timerWindow) {
                timerWindow.remove();
            }

            // Викликаємо завершення вивчення
            completeStudy(scienceObj.id, level);
        }
    }, 1000);
}

// Функція для завершення вивчення
function completeStudy(scienceId, level) {
    // Відправляємо запит на сервер для завершення вивчення
    fetch('/api/complete-study', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            scienceId: scienceId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Вивчення науки ${scienceId} завершено`);

            // Оновлюємо рівень науки в менеджері
            if (window.scienceDataManager) {
                const currentLevel = window.scienceDataManager.getScienceLevel(scienceId);
                window.scienceDataManager.setScienceLevel(scienceId, currentLevel + 1);
            }

            // Оновлюємо індикатор рівня безпосередньо
            const levelIndicator = document.getElementById(`level-indicator-${scienceId}`);
            if (levelIndicator && window.scienceDataManager) {
                const newLevel = window.scienceDataManager.getScienceLevel(scienceId);
                levelIndicator.textContent = newLevel;
            }

            // Оновлюємо індикатори для озброєння та кораблів
            if (scienceId.startsWith('weapon_') || scienceId.startsWith('ship_')) {
                if (window.scienceDataManager) {
                    const laserLevel = window.scienceDataManager.getScienceLevel('weapon_laser');
                    const missileLevel = window.scienceDataManager.getScienceLevel('weapon_missile');
                    const fighterLevel = window.scienceDataManager.getScienceLevel('ship_fighter');
                    const cruiserLevel = window.scienceDataManager.getScienceLevel('ship_cruiser');
                    
                    const laserIndicator = document.getElementById('weapon-laser-level');
                    const missileIndicator = document.getElementById('weapon-missile-level');
                    const fighterIndicator = document.getElementById('ship-fighter-level');
                    const cruiserIndicator = document.getElementById('ship-cruiser-level');
                    
                    if (laserIndicator) laserIndicator.textContent = laserLevel || 0;
                    if (missileIndicator) missileIndicator.textContent = missileLevel || 0;
                    if (fighterIndicator) fighterIndicator.textContent = fighterLevel || 0;
                    if (cruiserIndicator) cruiserIndicator.textContent = cruiserLevel || 0;
                }
            }

            // Оно��люємо відображення наук, збер��гаючи активну вкладку
            if (window.renderScienceBlocks) {
                // Зберігаємо активну вкладку перед ��новленням
                const savedActiveTab = activeScienceTab;
                window.renderScienceBlocks();

                // Відновлюємо активну вк��адку після он��влення
                setTimeout(() => {
                    const basicTabBtn = document.getElementById('basic-tab-btn');
                    const buildingsTabBtn = document.getElementById('buildings-tab-btn');
                    const weaponsTabBtn = document.getElementById('weapons-tab-btn');
                    const shipsTabBtn = document.getElementById('ships-tab-btn');
                    const basicTabContent = document.getElementById('basic-tab-content');
                    const buildingsTabContent = document.getElementById('buildings-tab-content');
                    const weaponsTabContent = document.getElementById('weapons-tab-content');
                    const shipsTabContent = document.getElementById('ships-tab-content');

                    // Скидаємо всі вкладки
                    if (basicTabContent) basicTabContent.style.display = 'none';
                    if (buildingsTabContent) buildingsTabContent.style.display = 'none';
                    if (weaponsTabContent) weaponsTabContent.style.display = 'none';
                    if (shipsTabContent) shipsTabContent.style.display = 'none';
                    if (basicTabBtn) basicTabBtn.style.background = '#17607a';
                    if (buildingsTabBtn) buildingsTabBtn.style.background = '#17607a';
                    if (weaponsTabBtn) weaponsTabBtn.style.background = '#17607a';
                    if (shipsTabBtn) shipsTabBtn.style.background = '#17607a';

                    // Відновлюємо активну вкладку
                    if (savedActiveTab === 'basic' && basicTabContent && basicTabBtn) {
                        basicTabContent.style.display = 'block';
                        basicTabBtn.style.background = '#1fa2c7';
                    } else if (savedActiveTab === 'buildings' && buildingsTabContent && buildingsTabBtn) {
                        buildingsTabContent.style.display = 'block';
                        buildingsTabBtn.style.background = '#1fa2c7';
                    } else if (savedActiveTab === 'weapons' && weaponsTabContent && weaponsTabBtn) {
                        weaponsTabContent.style.display = 'block';
                        weaponsTabBtn.style.background = '#1fa2c7';
                    } else if (savedActiveTab === 'ships' && shipsTabContent && shipsTabBtn) {
                        shipsTabContent.style.display = 'block';
                        shipsTabBtn.style.background = '#1fa2c7';
                    }

                    // Оновлюємо індикатори рівнів для всіх вкладок
                    if (window.scienceDataManager) {
                        // Оновлюємо індикатори для озброєння
                        const laserLevel = window.scienceDataManager.getScienceLevel('weapon_laser');
                        const missileLevel = window.scienceDataManager.getScienceLevel('weapon_missile');
                        const laserIndicator = document.getElementById('weapon-laser-level');
                        const missileIndicator = document.getElementById('weapon-missile-level');
                        if (laserIndicator) laserIndicator.textContent = laserLevel || 0;
                        if (missileIndicator) missileIndicator.textContent = missileLevel || 0;

                        // Оновлюємо індикатори для кораблів
                        const fighterLevel = window.scienceDataManager.getScienceLevel('ship_fighter');
                        const cruiserLevel = window.scienceDataManager.getScienceLevel('ship_cruiser');
                        const fighterIndicator = document.getElementById('ship-fighter-level');
                        const cruiserIndicator = document.getElementById('ship-cruiser-level');
                        if (fighterIndicator) fighterIndicator.textContent = fighterLevel || 0;
                        if (cruiserIndicator) cruiserIndicator.textContent = cruiserLevel || 0;

                        // Оновлюємо індикатори для будівель
                        const centerLevel = window.scienceDataManager.getScienceLevel('building_center');
                        const sourceLevel = window.scienceDataManager.getScienceLevel('building_source');
                        const houseLevel = window.scienceDataManager.getScienceLevel('building_house');
                        const warehouseLevel = window.scienceDataManager.getScienceLevel('building_warehouse');
                        const stoneQuarryLevel = window.scienceDataManager.getScienceLevel('building_stone_quarry');
                        const woodCutterLevel = window.scienceDataManager.getScienceLevel('building_wood_cutter');

                        const centerIndicator = document.getElementById('building-level-center-indicator');
                        const sourceIndicator = document.getElementById('building-level-source-indicator');
                        const houseIndicator = document.getElementById('building-level-house-indicator');
                        const warehouseIndicator = document.getElementById('building-level-warehouse-indicator');
                        const stoneQuarryIndicator = document.getElementById('building-level-stone-quarry-indicator');
                        const woodCutterIndicator = document.getElementById('building-level-wood-cutter-indicator');

                        if (centerIndicator) centerIndicator.textContent = centerLevel || 0;
                        if (sourceIndicator) sourceIndicator.textContent = sourceLevel || 0;
                        if (houseIndicator) houseIndicator.textContent = houseLevel || 0;
                        if (warehouseIndicator) warehouseIndicator.textContent = warehouseLevel || 0;
                        if (stoneQuarryIndicator) stoneQuarryIndicator.textContent = stoneQuarryLevel || 0;
                        if (woodCutterIndicator) woodCutterIndicator.textContent = woodCutterLevel || 0;
                    }
                }, 100); // Невелика затримка для того, щоб DOM оновився
            }
        } else {
            console.error('Помилка при завершенні вивчення:', data.message);
        }
    })
    .catch(error => {
        console.error('Помилка при відправленні запиту на сервер:', error);
    });
}

// Функція для скасування вивчення
window.cancelStudy = function() {
    // Відправляємо запит на сервер для скасування вивчення
    fetch('/api/cancel-study', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Вивчення скасовано');

            // Прибираємо вікно таймера
            const timerWindow = document.getElementById('study-timer');
            if (timerWindow) {
                timerWindow.remove();
            }

            // Оновлюємо відображення наук, зберігаючи активну вкладку
            if (window.renderScienceBlocks) {
                // Зберігаємо активну вкладку перед оновленням
                const savedActiveTab = activeScienceTab;
                window.renderScienceBlocks();

                // Відновлюємо активну вкладку після оновлення
                setTimeout(() => {
                    const basicTabBtn = document.getElementById('basic-tab-btn');
                    const buildingsTabBtn = document.getElementById('buildings-tab-btn');
                    const weaponsTabBtn = document.getElementById('weapons-tab-btn');
                    const shipsTabBtn = document.getElementById('ships-tab-btn');
                    const basicTabContent = document.getElementById('basic-tab-content');
                    const buildingsTabContent = document.getElementById('buildings-tab-content');
                    const weaponsTabContent = document.getElementById('weapons-tab-content');
                    const shipsTabContent = document.getElementById('ships-tab-content');

                    // Скидаємо всі вкладки
                    if (basicTabContent) basicTabContent.style.display = 'none';
                    if (buildingsTabContent) buildingsTabContent.style.display = 'none';
                    if (weaponsTabContent) weaponsTabContent.style.display = 'none';
                    if (shipsTabContent) shipsTabContent.style.display = 'none';
                    if (basicTabBtn) basicTabBtn.style.background = '#17607a';
                    if (buildingsTabBtn) buildingsTabBtn.style.background = '#17607a';
                    if (weaponsTabBtn) weaponsTabBtn.style.background = '#17607a';
                    if (shipsTabBtn) shipsTabBtn.style.background = '#17607a';

                    // Відновлюємо активну вкладку
                    if (savedActiveTab === 'basic' && basicTabContent && basicTabBtn) {
                        basicTabContent.style.display = 'block';
                        basicTabBtn.style.background = '#1fa2c7';
                    } else if (savedActiveTab === 'buildings' && buildingsTabContent && buildingsTabBtn) {
                        buildingsTabContent.style.display = 'block';
                        buildingsTabBtn.style.background = '#1fa2c7';
                    } else if (savedActiveTab === 'weapons' && weaponsTabContent && weaponsTabBtn) {
                        weaponsTabContent.style.display = 'block';
                        weaponsTabBtn.style.background = '#1fa2c7';
                    } else if (savedActiveTab === 'ships' && shipsTabContent && shipsTabBtn) {
                        shipsTabContent.style.display = 'block';
                        shipsTabBtn.style.background = '#1fa2c7';
                    }

                    // Оновлюємо індикатори рівнів для всіх вкладок
                    if (window.scienceDataManager) {
                        // Оновлюємо індикатори для озброєння
                        const laserLevel = window.scienceDataManager.getScienceLevel('weapon_laser');
                        const missileLevel = window.scienceDataManager.getScienceLevel('weapon_missile');
                        const laserIndicator = document.getElementById('weapon-laser-level');
                        const missileIndicator = document.getElementById('weapon-missile-level');
                        if (laserIndicator) laserIndicator.textContent = laserLevel || 0;
                        if (missileIndicator) missileIndicator.textContent = missileLevel || 0;

                        // Оновлюємо індикатори для кораблів
                        const fighterLevel = window.scienceDataManager.getScienceLevel('ship_fighter');
                        const cruiserLevel = window.scienceDataManager.getScienceLevel('ship_cruiser');
                        const fighterIndicator = document.getElementById('ship-fighter-level');
                        const cruiserIndicator = document.getElementById('ship-cruiser-level');
                        if (fighterIndicator) fighterIndicator.textContent = fighterLevel || 0;
                        if (cruiserIndicator) cruiserIndicator.textContent = cruiserLevel || 0;

                        // Оновлюємо індикатори для будівель
                        const centerLevel = window.scienceDataManager.getScienceLevel('building_center');
                        const sourceLevel = window.scienceDataManager.getScienceLevel('building_source');
                        const houseLevel = window.scienceDataManager.getScienceLevel('building_house');
                        const warehouseLevel = window.scienceDataManager.getScienceLevel('building_warehouse');
                        const stoneQuarryLevel = window.scienceDataManager.getScienceLevel('building_stone_quarry');
                        const woodCutterLevel = window.scienceDataManager.getScienceLevel('building_wood_cutter');

                        const centerIndicator = document.getElementById('building-level-center-indicator');
                        const sourceIndicator = document.getElementById('building-level-source-indicator');
                        const houseIndicator = document.getElementById('building-level-house-indicator');
                        const warehouseIndicator = document.getElementById('building-level-warehouse-indicator');
                        const stoneQuarryIndicator = document.getElementById('building-level-stone-quarry-indicator');
                        const woodCutterIndicator = document.getElementById('building-level-wood-cutter-indicator');

                        if (centerIndicator) centerIndicator.textContent = centerLevel || 0;
                        if (sourceIndicator) sourceIndicator.textContent = sourceLevel || 0;
                        if (houseIndicator) houseIndicator.textContent = houseLevel || 0;
                        if (warehouseIndicator) warehouseIndicator.textContent = warehouseLevel || 0;
                        if (stoneQuarryIndicator) stoneQuarryIndicator.textContent = stoneQuarryLevel || 0;
                        if (woodCutterIndicator) woodCutterIndicator.textContent = woodCutterLevel || 0;
                    }
                }, 100); // Невелика затримка для того, щоб DOM оновився
            }
        } else {
            console.error('Помилка при скасуванні вивчення:', data.message);
        }
    })
    .catch(error => {
        console.error('Помилка при відправленні запиту на сервер:', error);
    });
}

// Експортуємо функцію для глобального використання
window.renderScienceBlocks = renderScienceBlocks;
