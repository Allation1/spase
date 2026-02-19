// Файл для відображення будівель у вікні планети

// Функція для завантаження даних будівель
async function loadBuildingsData() {
    try {
        const response = await fetch('/planets/tera/buildings.json');
        if (response.ok) {
            return await response.json();
        } else {
            // Якщо файл не існує, створюємо стандартні значення
            return {
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
    } catch (error) {
        console.error('Помилка при завантаженні даних будівель:', error);
        return {
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
}

// Функція для збереження даних будівель
async function saveBuildingsData(buildingsData) {
    try {
        const response = await fetch('/api/save-buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buildingsData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Дані будівель збережено успішно:', result);
    } catch (error) {
        console.error('Помилка при збереженні даних будівель:', error);
    }
}

// Функція для відображення будівель у вікні планети
async function renderBuildingsInPlanetWindow() {
    // Завантажуємо дані будівель
    const buildingsData = await loadBuildingsData();

    // Отримуємо або створюємо вікно будівель
    let buildingsWindow = document.getElementById('buildings-window');

    if (!buildingsWindow) {
        buildingsWindow = document.createElement('div');
        buildingsWindow.id = 'buildings-window';
        buildingsWindow.className = 'science-details-window';
        buildingsWindow.innerHTML = `
            <div class="science-details-header">
                <div class="science-details-title" style="text-align: center; justify-content: center;">🏗️ Будівлі</div>
                <button class="science-close-btn">✕</button>
            </div>
            <div class="science-details-content"></div>
        `;
        document.body.appendChild(buildingsWindow);
    }

    // Показуємо вікно
    buildingsWindow.style.display = 'block';

    // Оновлюємо вміст
    const content = buildingsWindow.querySelector('.science-details-content');

    // Створюємо HTML для будівель
    let buildingsHtml = `
        <div id="buildings-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
    `;

    // Додаємо будівлі науковий центр та джерело
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
        }
    ];

    buildings.forEach(building => {
        const buildingData = buildingsData[building.id];
        const count = buildingData.count;
        const level = buildingData.level;

        buildingsHtml += `
            <div class="science-section" style="cursor: pointer;">
                <div class="science-block-title">${building.icon} ${building.name}</div>
                <div class="science-level-indicator" style="
                    background: #17607a;
                    border: 1px solid #1fa2c7;
                    border-radius: 4px;
                    padding: 2px 8px;
                    color: white;
                    font-size: 0.6em;
                    display: inline-block;
                    margin-top: -10px;
                    text-align: center;
                    width: fit-content;
                    align-self: flex-start;
                " id="building-count-${building.id}">${count}</div>
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
            </div>
        `;
    });

    buildingsHtml += `
        </div>
    `;

    content.innerHTML = buildingsHtml;

    // Додаємо можливість рухати вікно мишкою
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;

    const header = buildingsWindow.querySelector('.science-details-header');
    header.addEventListener('mousedown', function(e) {
        // Перевіряємо, чи клік відбувся на заголовку (але не на кнопці закриття)
        if (e.target.classList.contains('science-details-title')) {
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            buildingsWindow.style.cursor = 'move';
            buildingsWindow.style.transition = 'none';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            buildingsWindow.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        buildingsWindow.style.cursor = 'default';
        buildingsWindow.style.transition = '';
    });

    // Додаємо обробник для кнопки закриття
    const closeBtn = buildingsWindow.querySelector('.science-close-btn');
    closeBtn.onclick = () => {
        buildingsWindow.style.display = 'none';
    };
}

// Функція для початку будівництва
async function startBuilding(buildingId, buildingName) {
    // Отримуємо кількість будівель для побудови
    const countInput = document.getElementById(`build-count-${buildingId}`);
    const count = countInput ? parseInt(countInput.value) || 1 : 1;

    // Розраховуємо час будівництва (1 будівля = 5 секунд, 10 будівель = 50 секунд)
    const constructionTime = count * 5; // 5 секунд на будівлю

    // Показуємо таймер будівництва
    showConstructionTimer(buildingId, buildingName, count, constructionTime);

    // Завантажуємо поточні дані будівель
    const buildingsData = await loadBuildingsData();

    // Оновлюємо час будівництва
    buildingsData[buildingId].construction_time = Date.now() + (constructionTime * 1000);

    // Зберігаємо оновлені дані
    await saveBuildingsData(buildingsData);

    // Запускаємо процес будівництва
    setTimeout(async () => {
        // Коли будівництво завершено, збільшуємо кількість будівель
        const finalBuildingsData = await loadBuildingsData();
        finalBuildingsData[buildingId].count += count;
        finalBuildingsData[buildingId].construction_time = 0; // Скидаємо час будівництва

        // Зберігаємо фінальні дані
        await saveBuildingsData(finalBuildingsData);

        console.log(`Побудовано ${count} одиниць будівлі ${buildingName}. Загальна кількість: ${finalBuildingsData[buildingId].count}`);

        // Показуємо повідомлення про успішне будівництво
        alert(`Успішно побудовано ${count} одиниць будівлі ${buildingName}!`);

        // Оновлюємо відображення
        await renderBuildingsInPlanetWindow();
    }, constructionTime * 1000); // Час в мілісекундах
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
        <button onclick="cancelBuilding('${buildingId}')" style="
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
    // Завантажуємо поточні дані будівель
    const buildingsData = await loadBuildingsData();
    
    // Скидаємо час будівництва
    buildingsData[buildingId].construction_time = 0;
    
    // Зберігаємо оновлені дані
    await saveBuildingsData(buildingsData);
    
    // Прибираємо вікно таймера
    const timerWindow = document.getElementById('construction-timer');
    if (timerWindow) {
        timerWindow.remove();
    }
    
    console.log(`Будівництво для ${buildingId} скасовано`);
}

// Експортуємо функції для глобального використання
window.renderBuildingsInPlanetWindow = renderBuildingsInPlanetWindow;
window.startBuilding = startBuilding;
window.cancelBuilding = cancelBuilding;