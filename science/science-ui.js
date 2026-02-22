// Динамічне створення вікна наук

import { sciences } from './science-data.js';
import { checkScienceRequirements } from './science-dependencies.js';

function renderScienceBlocks() {
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
    bringWindowToFront(scienceWindow);

    // Оновлюємо заголовок
    const header = scienceWindow.querySelector('.science-details-header');
    header.innerHTML = `<div class="science-details-title" style="text-align: center; justify-content: center;">🔬 Наука</div>`;

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

        sciencesHtml += `
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">${science.icon} ${science.name}</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="level-indicator-${science.id}">${currentLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="level-${science.id}" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudy('${science.id}', '${JSON.stringify(science).replace(/"/g, '&quot;')}')"
                                    ${canStudy ? '' : 'disabled'}
                                    style="${canStudy ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
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

    const buildingsHtml = `
                </div>
            </div>
            <div id="buildings-tab-content" style="display: none;">
                <div id="buildings-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">🔬 Науковий центр</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="building-level-center-indicator">${centerLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="building-level-center" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('center', 'Науковий центр')"
                                    ${canStudyCenter ? '' : 'disabled'}
                                    style="${canStudyCenter ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
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
                        <div class="science-block-title">💧 Джерело</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="building-level-source-indicator">${sourceLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="building-level-source" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('source', 'Джерело')"
                                    ${canStudySource ? '' : 'disabled'}
                                    style="${canStudySource ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
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
                        <div class="science-block-title">🏠 Будинок</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="building-level-house-indicator">${houseLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="building-level-house" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('house', 'Будинок')"
                                    ${canStudyHouse ? '' : 'disabled'}
                                    style="${canStudyHouse ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
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
                        <div class="science-block-title">📦 Склад</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="building-level-warehouse-indicator">${warehouseLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="building-level-warehouse" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('warehouse', 'Склад')"
                                    ${canStudyWarehouse ? '' : 'disabled'}
                                    style="${canStudyWarehouse ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
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
                        <div class="science-block-title">🪨 Каменярня</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="building-level-stone-quarry-indicator">${stoneQuarryLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="building-level-stone-quarry" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('stone_quarry', 'Каменярня')">
                                Вивчити
                            </button>
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">🪵 Лісоруб</div>
                        <div class="science-level-indicator" style="
                            background: #17607a;
                            border: 1px solid #1fa2c7;
                            border-radius: 4px;
                            padding: 2px 8px; /* Збільшили горизонтальні відступи для кращого вигляду */
                            color: white;
                            font-size: 0.6em;
                            display: inline-block; /* Встановлюємо як inline-block для автоматичної ширини */
                            margin-top: -10px; /* Підняли вище, щоб був ближче до заголовка */
                            text-align: center;
                            width: fit-content; /* Встановлюємо ширину відповідно до вмісту */
                            align-self: flex-start; /* Вирівнюємо елемент по лівому краю */
                        " id="building-level-wood-cutter-indicator">${woodCutterLevel}</div>
                        <div class="science-controls">
                            <input type="number" id="building-level-wood-cutter" value="1" min="1" style="
                                width: 35px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 2px;
                                /* Прибираємо стрілочки для числового поля */
                                -moz-appearance: textfield; /* Firefox */
                            ">
                            <button class="study-btn"
                                    onclick="startStudyForBuilding('wood_cutter', 'Лісоруб')">
                                Вивчити
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="weapons-tab-content" style="display: none;">
                <div id="weapons-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">🔫 Лазерна гармата</div>
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
                            margin-top: -10px;
                        " id="weapon-laser-level">0</div>
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="weapon-laser-count" value="1" min="1" style="
                                width: 35px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 5px;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForWeapon('laser', 'Лазерна гармата')" style="height: 18px; text-align: center; line-height: 18px; padding: 0 8px;">Вивчити</button>
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">🚀 Ракетна установка</div>
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
                            margin-top: -10px;
                        " id="weapon-missile-level">0</div>
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="weapon-missile-count" value="1" min="1" style="
                                width: 35px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 5px;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForWeapon('missile', 'Ракетна установка')" style="height: 18px; text-align: center; line-height: 18px; padding: 0 8px;">Вивчити</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="ships-tab-content" style="display: none;">
                <div id="ships-blocks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">✈️ Винищувач</div>
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
                            margin-top: -10px;
                        " id="ship-fighter-level">0</div>
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="ship-fighter-count" value="1" min="1" style="
                                width: 35px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 5px;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForShip('fighter', 'Винищувач')" style="height: 18px; text-align: center; line-height: 18px; padding: 0 8px;">Вивчити</button>
                        </div>
                    </div>
                    <div class="science-section" style="cursor: pointer; position: relative;">
                        <div class="science-block-title">🚀 Крейсер</div>
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
                            margin-top: -10px;
                        " id="ship-cruiser-level">0</div>
                        <div class="science-controls" style="display: flex; align-items: center;">
                            <input type="number" id="ship-cruiser-count" value="1" min="1" style="
                                width: 35px;
                                height: 18px;
                                background: #0e3a47;
                                color: white;
                                border: 1px solid #1fa2c7;
                                border-radius: 4px;
                                padding: 2px;
                                font-size: 0.7em;
                                margin-right: 5px;
                                -moz-appearance: textfield;
                            ">
                            <button class="study-btn" onclick="startStudyForShip('cruiser', 'Крейсер')" style="height: 18px; text-align: center; line-height: 18px; padding: 0 8px;">Вивчити</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Встановлюємо вміст вікна
    content.innerHTML = tabsHtml + sciencesHtml + buildingsHtml;

    // Додаємо обробники для вкладок
    const basicTabBtn = document.getElementById('basic-tab-btn');
    const buildingsTabBtn = document.getElementById('buildings-tab-btn');
    const basicTabContent = document.getElementById('basic-tab-content');
    const buildingsTabContent = document.getElementById('buildings-tab-content');

    basicTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'block';
        buildingsTabContent.style.display = 'none';
        basicTabBtn.style.background = '#1fa2c7';
        buildingsTabBtn.style.background = '#17607a';
    });

    buildingsTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'block';
        buildingsTabBtn.style.background = '#1fa2c7';
        basicTabBtn.style.background = '#17607a';
    });

    // Додаємо обробники для нових вкладок
    const weaponsTabBtn = document.getElementById('weapons-tab-btn');
    const shipsTabBtn = document.getElementById('ships-tab-btn');
    const weaponsTabContent = document.getElementById('weapons-tab-content');
    const shipsTabContent = document.getElementById('ships-tab-content');

    weaponsTabBtn.addEventListener('click', () => {
        basicTabContent.style.display = 'none';
        buildingsTabContent.style.display = 'none';
        weaponsTabContent.style.display = 'block';
        shipsTabContent.style.display = 'none';
        basicTabBtn.style.background = '#17607a';
        buildingsTabBtn.style.background = '#17607a';
        weaponsTabBtn.style.background = '#1fa2c7';
        shipsTabBtn.style.background = '#17607a';
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

    // Додаємо можливість рухати вікно мишкою
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;

    scienceWindow.addEventListener('mousedown', function(e) {
        // Перевіряємо, чи клік відбувся на заголовку
        if (e.target.classList.contains('science-details-title') || e.target.parentElement.classList.contains('science-details-title')) {
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            scienceWindow.style.cursor = 'move';
            scienceWindow.style.transition = 'none';
            // Піднімаємо вікно на передній план при кліку
            bringWindowToFront(scienceWindow);
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            scienceWindow.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        scienceWindow.style.cursor = 'default';
        scienceWindow.style.transition = '';
    });

    // Додаємо обробник для кнопки закриття
    const closeBtn = scienceWindow.querySelector('.science-close-btn');
    closeBtn.onclick = () => {
        scienceWindow.style.display = 'none';
    };
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
        timerWindow.innerHTML = '<div class="timer-title">⏱️ Процес вивчення</div><div id="timer-content"></div>';
        document.body.appendChild(timerWindow);
    }

    // Оновлюємо вміст таймера
    const timerContent = document.getElementById('timer-content');
    timerContent.innerHTML = `
        <div>Вивчається: ${scienceObj.name} (рівень ${level})</div>
        <div id="countdown-${scienceObj.id}">Час: ${estimatedTime}с</div>
        <button onclick="cancelStudy()" style="
            background: #17607a;
            color: white;
            border: 1px solid #1fa2c7;
            border-radius: 4px;
            padding: 4px 8px;
            margin-top: 5px;
            cursor: pointer;
            width: 100%;
        ">Скасувати вивчення</button>
    `;

    // Запускаємо таймер
    let secondsLeft = estimatedTime;
    const countdownElement = document.getElementById(`countdown-${scienceObj.id}`);

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

            // Оновлюємо відображення наук, зберігаючи активну вкладку
            if (window.renderScienceBlocks) {
                // Зберігаємо активну вкладку перед оновленням
                const activeTab = document.getElementById('buildings-tab-content')?.style.display === 'block' ? 'buildings' : 'basic';
                window.renderScienceBlocks();

                // Відновлюємо активну вкладку після оновлення
                setTimeout(() => {
                    if (activeTab === 'buildings') {
                        const basicTabBtn = document.getElementById('basic-tab-btn');
                        const buildingsTabBtn = document.getElementById('buildings-tab-btn');
                        const basicTabContent = document.getElementById('basic-tab-content');
                        const buildingsTabContent = document.getElementById('buildings-tab-content');

                        if (basicTabContent && buildingsTabContent) {
                            basicTabContent.style.display = 'none';
                            buildingsTabContent.style.display = 'block';
                            if (buildingsTabBtn) buildingsTabBtn.style.background = '#1fa2c7';
                            if (basicTabBtn) basicTabBtn.style.background = '#17607a';
                        }
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
                const activeTab = document.getElementById('buildings-tab-content')?.style.display === 'block' ? 'buildings' : 'basic';
                window.renderScienceBlocks();

                // Відновлюємо активну вкладку після оновлення
                setTimeout(() => {
                    if (activeTab === 'buildings') {
                        const basicTabBtn = document.getElementById('basic-tab-btn');
                        const buildingsTabBtn = document.getElementById('buildings-tab-btn');
                        const basicTabContent = document.getElementById('basic-tab-content');
                        const buildingsTabContent = document.getElementById('buildings-tab-content');

                        if (basicTabContent && buildingsTabContent) {
                            basicTabContent.style.display = 'none';
                            buildingsTabContent.style.display = 'block';
                            if (buildingsTabBtn) buildingsTabBtn.style.background = '#1fa2c7';
                            if (basicTabBtn) basicTabBtn.style.background = '#17607a';
                        }
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