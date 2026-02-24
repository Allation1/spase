const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware для обробки JSON
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Змінна для відстеження активного вивчення (одночасно можна вивчати тільки одну науку)
let activeStudy = null;

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ендпоінт для початку вивчення науки
app.post('/api/start-study', (req, res) => {
    const { scienceId, level } = req.body;

    // Перевіряємо, чи вже не вивчається якась наука (базова або будівля)
    if (activeStudy) {
        return res.json({
            success: false,
            message: 'Вже вивчається інша наука. Завершіть або скасуйте поточне вивчення.'
        });
    }

    // Розраховуємо приблизний час вивчення з урахуванням рівня (кожен наступний рівень на 20% довше)
    const baseTime = 5; // базовий час для першого рівня (в секундах)
    const timeMultiplier = Math.pow(1.2, level - 1); // кожен наступний рівень на 20% довше
    const estimatedTime = Math.floor(baseTime * timeMultiplier);

    // Зберігаємо інформацію про активне вивчення
    activeStudy = {
        scienceId: scienceId,
        level: level,
        startTime: Date.now(),
        estimatedTime: estimatedTime
    };

    res.json({
        success: true,
        message: `Вивчення науки ${scienceId} рівня ${level} розпочато`,
        estimatedTime: estimatedTime
    });
});

// Ендпоінт для завершення вивчення науки
app.post('/api/complete-study', (req, res) => {
    const { scienceId } = req.body;

    // Перевіряємо, чи це активне вивчення
    if (activeStudy && activeStudy.scienceId === scienceId) {
        // Завершуємо вивчення
        activeStudy = null;

        // Оновлюємо рівень науки
        const fs = require('fs');
        const path = require('path');
        const scienceLevelsPath = path.join(__dirname, 'science', 'science-levels.json');

        try {
            let scienceLevels = {};
            if (fs.existsSync(scienceLevelsPath)) {
                scienceLevels = JSON.parse(fs.readFileSync(scienceLevelsPath, 'utf8'));
            }

            // Встановлюємо новий рівень (поточний рівень + 1)
            const newLevel = (scienceLevels[scienceId] || 0) + 1;
            scienceLevels[scienceId] = newLevel;

            // Зберігаємо оновлені рівні наук
            fs.writeFileSync(scienceLevelsPath, JSON.stringify(scienceLevels, null, 4));

            res.json({
                success: true,
                message: `Вивчення науки ${scienceId} завершено`
            });
        } catch (error) {
            console.error('Помилка при завершенні вивчення:', error);
            res.json({
                success: false,
                message: 'Помилка при завершенні вивчення'
            });
        }
    } else {
        // Якщо наука вже не вивчається, але ми все одно хочемо оновити рівень (це може статися, якщо таймер вичерпався на сервері)
        // Це нормальна ситуація, коли клієнт викликає цей ендпоінт після того, як таймер вичерпався
        const fs = require('fs');
        const path = require('path');
        const scienceLevelsPath = path.join(__dirname, 'science', 'science-levels.json');

        try {
            let scienceLevels = {};
            if (fs.existsSync(scienceLevelsPath)) {
                scienceLevels = JSON.parse(fs.readFileSync(scienceLevelsPath, 'utf8'));
            }

            // Встановлюємо новий рівень (поточний рівень + 1)
            const newLevel = (scienceLevels[scienceId] || 0) + 1;
            scienceLevels[scienceId] = newLevel;

            // Зберігаємо оновлені рівні наук
            fs.writeFileSync(scienceLevelsPath, JSON.stringify(scienceLevels, null, 4));

            res.json({
                success: true,
                message: `Вивчення науки ${scienceId} завершено`
            });
        } catch (error) {
            console.error('Помилка при завершенні вивчення:', error);
            res.json({
                success: false,
                message: 'Помилка при завершенні вивчення'
            });
        }
    }
});

// Ендпоінт для отримання статусу вивчення
app.get('/api/study-status', (req, res) => {
    if (activeStudy) {
        // Розраховуємо залишок часу
        const elapsed = (Date.now() - activeStudy.startTime) / 1000; // в секундах
        let remainingTime = Math.max(0, Math.floor(activeStudy.estimatedTime - elapsed)); // використовуємо floor для правильного округлення

        // Якщо час вийшов, завершуємо вивчення
        if (remainingTime <= 0) {
            remainingTime = 0;

            // Завершуємо вивчення
            activeStudy = null;

            // Повертаємо статус, що вивчення завершено
            return res.json({
                studying: false,
                currentScience: null,
                currentLevel: 1,
                remainingTime: 0
            });
        }

        // Імпортуємо наукові дані для отримання повної інформації про науку
        const fs = require('fs');
        const path = require('path');

        // Використовуємо заздалегідь визначені науки
        const knownSciences = {
            physics: { id: 'physics', name: 'Фізика' },
            chemistry: { id: 'chemistry', name: 'Хімія' },
            biology: { id: 'biology', name: 'Біологія' },
            geometry: { id: 'geometry', name: 'Геометрія' },
            astronomy: { id: 'astronomy', name: 'Астрономія' },
            materials: { id: 'materials', name: 'Матеріалознавство' },
            hydrogeology: { id: 'hydrogeology', name: 'Гідрогеологія' },
            building_center: { id: 'building_center', name: 'Науковий центр' },
            building_source: { id: 'building_source', name: 'Джерело' }
        };

        if (!activeStudy) {
            return res.json({
                studying: false,
                currentScience: null,
                currentLevel: 1,
                remainingTime: 0
            });
        }

        const scienceInfo = knownSciences[activeStudy.scienceId] || { id: activeStudy.scienceId, name: activeStudy.scienceId };

        res.json({
            studying: true,
            currentScience: scienceInfo,
            currentLevel: activeStudy.level,
            remainingTime: remainingTime
        });
    } else {
        res.json({
            studying: false,
            currentScience: null,
            currentLevel: 1,
            remainingTime: 0
        });
    }
});

// Ендпоінт для збереження рівнів наук
app.post('/api/save-science-levels', (req, res) => {
    const scienceLevels = req.body;

    // Зберігаємо рівні наук у файл
    const fs = require('fs');
    const path = require('path');
    const scienceLevelsPath = path.join(__dirname, 'science', 'science-levels.json');

    try {
        fs.writeFileSync(scienceLevelsPath, JSON.stringify(scienceLevels, null, 4));
        res.json({ success: true, message: 'Рівні наук збережено успішно' });
    } catch (error) {
        console.error('Помилка при збереженні рівнів наук:', error);
        res.status(500).json({ success: false, message: 'Помилка при збереженні рівнів наук' });
    }
});

// Ендпоінт для отримання рівнів наук
app.get('/api/science-levels', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const scienceLevelsPath = path.join(__dirname, 'science', 'science-levels.json');

    try {
        if (fs.existsSync(scienceLevelsPath)) {
            const scienceLevels = JSON.parse(fs.readFileSync(scienceLevelsPath, 'utf8'));
            res.json(scienceLevels);
        } else {
            res.json({});
        }
    } catch (error) {
        console.error('Помилка при отриманні рівнів наук:', error);
        res.status(500).json({ success: false, message: 'Помилка при отриманні рівнів наук' });
    }
});

// Ендпоінт для скасування вивчення науки
app.post('/api/cancel-study', (req, res) => {
    if (activeStudy) {
        // Скасовуємо активне вивчення
        activeStudy = null;

        res.json({
            success: true,
            message: 'Вивчення скасовано'
        });
    } else {
        res.json({
            success: false,
            message: 'Немає активного вивчення для скасування'
        });
    }
});

// Ендпоінт для збереження виробництва
app.post('/api/save-production', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const productionData = req.body;
    const productionPath = path.join(__dirname, 'planets', 'tera', 'production.json');

    try {
        fs.writeFileSync(productionPath, JSON.stringify(productionData, null, 2));
        res.json({ success: true, message: 'Виробництво збережено успішно' });
    } catch (error) {
        console.error('Помилка при збереженні виробництва:', error);
        res.status(500).json({ success: false, message: 'Помилка при збереженні виробництва' });
    }
});

// Ендпоінт для збереження кораблів
app.post('/api/save-ships', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const shipsData = req.body;
    const shipsPath = path.join(__dirname, 'planets', 'tera', 'ships.json');

    try {
        fs.writeFileSync(shipsPath, JSON.stringify(shipsData, null, 2));
        res.json({ success: true, message: 'Кораблі збережено успішно' });
    } catch (error) {
        console.error('Помилка при збереженні кораблів:', error);
        res.status(500).json({ success: false, message: 'Помилка при збереженні кораблів' });
    }
});

// Ендпоінт для збереження флотів
app.post('/api/save-fleets', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const fleetsData = req.body;
    const fleetsPath = path.join(__dirname, 'planets', 'fleets.json');

    try {
        fs.writeFileSync(fleetsPath, JSON.stringify(fleetsData, null, 2));
        res.json({ success: true, message: 'Флоти збережено успішно' });
    } catch (error) {
        console.error('Помилка при збереженні флотів:', error);
        res.status(500).json({ success: false, message: 'Помилка при збереженні флотів' });
    }
});

// Ендпоінт для збереження бою
app.post('/api/save-battle', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const battleData = req.body;
    const battlePath = path.join(__dirname, 'battle', 'battle.json');

    try {
        fs.writeFileSync(battlePath, JSON.stringify(battleData, null, 2));
        res.json({ success: true, message: 'Бій збережено успішно' });
    } catch (error) {
        console.error('Помилка при збереженні бою:', error);
        res.status(500).json({ success: false, message: 'Помилка при збереженні бою' });
    }
});

// Ендпоінт для збереження зброї
app.post('/api/save-weapons', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const weaponsData = req.body;
    const weaponsPath = path.join(__dirname, 'planets', 'tera', 'weapons.json');

    try {
        fs.writeFileSync(weaponsPath, JSON.stringify(weaponsData, null, 2));
        res.json({ success: true, message: 'Зброю збережено успішно' });
    } catch (error) {
        console.error('Помилка при збереженні зброї:', error);
        res.status(500).json({ success: false, message: 'Помилка при збереженні зброї' });
    }
});

// Ендпоінт для отримання зброї
app.get('/planets/tera/weapons.json', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const weaponsPath = path.join(__dirname, 'planets', 'tera', 'weapons.json');

    try {
        if (fs.existsSync(weaponsPath)) {
            const weaponsData = JSON.parse(fs.readFileSync(weaponsPath, 'utf8'));
            res.json(weaponsData);
        } else {
            res.json({ weapons: [] });
        }
    } catch (error) {
        console.error('Помилка при отриманні зброї:', error);
        res.json({ weapons: [] });
    }
});

// Маршрут для отримання даних будівель
app.get('/planets/tera/buildings.json', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'planets', 'tera', 'buildings.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // Якщо файл не існує, повертаємо стандартні значення
            return res.json({
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
            });
        }

        try {
            const buildingsData = JSON.parse(data);
            res.json(buildingsData);
        } catch (parseError) {
            // Якщо помилка парсингу, повертаємо стандартні значення
            res.json({
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
            });
        }
    });
});

// Маршрут для збереження даних будівель
app.post('/api/save-buildings', (req, res) => {
    const buildingsData = req.body;
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'planets', 'tera', 'buildings.json');

    fs.writeFile(filePath, JSON.stringify(buildingsData, null, 2), (err) => {
        if (err) {
            console.error('Помилка при збереженні файлу:', err);
            return res.status(500).json({ success: false, message: 'Помилка при збереженні даних' });
        }

        res.json({ success: true, message: 'Дані будівель збережено успішно' });
    });
});


// Маршрут для отримання поточних ресурсів
app.get('/api/resources', (req, res) => {
    // Спробуємо знайти файл з даними планети
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'planets', 'tera', 'data.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // Якщо файл не існує, повертаємо стандартні значення
            return res.json({
                "Населення": 100,
                "Вода": 50,
                "Деревина": 50,
                "Каміння": 50
            });
        }

        try {
            const planetData = JSON.parse(data);
            res.json(planetData.resources || {
                "Населення": 100,
                "Вода": 50,
                "Деревина": 50,
                "Каміння": 50
            });
        } catch (parseError) {
            // Якщо помилка парсингу, повертаємо стандартні значення
            res.json({
                "Населення": 100,
                "Вода": 50,
                "Деревина": 50,
                "Каміння": 50
            });
        }
    });
});

// Маршрут для оновлення ресурсів
app.post('/api/update-resources', express.json(), (req, res) => {
    let resources = req.body;
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'planets', 'tera', 'data.json');

    // Видаляємо англомовні ресурси, щоб уникнути дублювання
    const allowedResources = ['Населення', 'Вода', 'Деревина', 'Каміння'];
    const filteredResources = {};
    for (const [key, value] of Object.entries(resources)) {
        if (allowedResources.includes(key)) {
            filteredResources[key] = value;
        }
    }
    resources = filteredResources;

    // Спочатку отримуємо поточні дані
    fs.readFile(filePath, 'utf8', (err, data) => {
        let planetData = {};

        if (!err && data) {
            try {
                planetData = JSON.parse(data);
            } catch (parseError) {
                console.error('Помилка парсингу даних планети:', parseError);
            }
        }

        // Оновлюємо ресурси
        planetData.resources = resources;

        // Зберігаємо оновлені дані
        fs.writeFile(filePath, JSON.stringify(planetData, null, 2), (err) => {
            if (err) {
                console.error('Помилка при збереженні даних планети:', err);
                return res.status(500).json({ success: false, message: 'Помилка при збереженні даних' });
            }

            res.json({ success: true, message: 'Ресурси оновлено успішно' });
        });
    });
});

// Функція для оновлення ресурсів кожну секунду
function startResourceUpdates() {
    // Інтервал для оновлення ресурсів кожну секунду
    setInterval(async () => {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'planets', 'tera', 'data.json');

        try {
            // Читаємо поточні дані
            let data = {};
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                if (fileContent) {
                    data = JSON.parse(fileContent);
                }
            } catch (readError) {
                // Якщо файл не існує або помилка читання, використовуємо стандартні значення
                data = {
                    resources: {
                        'Населення': 0,
                        'Вода': 0,
                        'Деревина': 0,
                        'Каміння': 0
                    }
                };
            }

            // Переконуємося, що поле resources існує
            if (!data.resources) {
                data.resources = {
                    'Населення': 0,
                    'Вода': 0,
                    'Деревина': 0,
                    'Каміння': 0
                };
            }

            // Додаємо базову генерацію до кожного ресурсу, але не більше 100 (базовий склад)
            data.resources['Населення'] = Math.min(100, data.resources['Населення'] + 1);
            data.resources['Вода'] = Math.min(100, data.resources['Вода'] + 1);
            data.resources['Деревина'] = Math.min(100, data.resources['Деревина'] + 1);
            data.resources['Каміння'] = Math.min(100, data.resources['Каміння'] + 1);

            // Видаляємо будь-які англомовні ресурси, щоб уникнути дублювання
            const allowedResources = ['Населення', 'Вода', 'Деревина', 'Каміння'];
            const filteredResources = {};
            for (const [key, value] of Object.entries(data.resources)) {
                if (allowedResources.includes(key)) {
                    filteredResources[key] = value;
                }
            }
            data.resources = filteredResources;

            // Зберігаємо оновлені дані
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

            console.log('Ресурси оновлено:', data.resources);
        } catch (error) {
            console.error('Помилка при оновленні ресурсів на сервері:', error);
        }
    }, 1000); // Кожну секунду
}

// Запускаємо оновлення ресурсів
startResourceUpdates();

// Генерація піратських флотів
const MAX_PIRATE_FLEETS = 5;
const PIRATE_SPAWN_COORDINATES = [
    // Сонячна система (2:2) - Тера
    '2:2:2', '2:2:3', '2:2:4', '2:2:5',
    // Блакитна система (0:4)
    '0:4:1', '0:4:2', '0:4:3', '0:4:4', '0:4:5',
    // Червона система (4:0) - Вулкан
    '4:0:1', '4:0:2', '4:0:3', '4:0:4', '4:0:5',
    // Зелена система (0:0) - Едем
    '0:0:1', '0:0:2', '0:0:3', '0:0:4', '0:0:5'
];

const PIRATE_SHIP_TEMPLATES = [
    { name: 'Винищувач', shipLevel: 1, weaponsCount: 2, weaponLevel: 1 },
    { name: 'Патрульний', shipLevel: 2, weaponsCount: 2, weaponLevel: 2 },
    { name: 'Нападник', shipLevel: 3, weaponsCount: 3, weaponLevel: 2 },
    { name: 'Рейдер', shipLevel: 4, weaponsCount: 4, weaponLevel: 3 },
    { name: 'Піратський крейсер', shipLevel: 5, weaponsCount: 5, weaponLevel: 4 }
];

function generatePirateFleet() {
    const fs = require('fs');
    const path = require('path');
    const fleetsPath = path.join(__dirname, 'planets', 'fleets.json');
    
    // Завантажуємо поточні флоти
    let fleetsData = { fleets: [] };
    try {
        if (fs.existsSync(fleetsPath)) {
            fleetsData = JSON.parse(fs.readFileSync(fleetsPath, 'utf8'));
        }
    } catch (e) {
        console.error('Помилка читання флотів:', e);
        return;
    }
    
    // Рахуємо піратські флоти
    const pirateFleets = fleetsData.fleets.filter(f => f.type === 'pirate');
    const pirateCount = pirateFleets.length;
    
    console.log(`Генерація піратів: поточний піратський флот = ${pirateCount}, макс = ${MAX_PIRATE_FLEETS}`);
    
    // Якщо вже 5 флотів - нічого не робимо
    if (pirateCount >= MAX_PIRATE_FLEETS) {
        return;
    }
    
    // Додаємо новий піратський флот
    const template = PIRATE_SHIP_TEMPLATES[Math.floor(Math.random() * PIRATE_SHIP_TEMPLATES.length)];
    const coordinates = PIRATE_SPAWN_COORDINATES[Math.floor(Math.random() * PIRATE_SPAWN_COORDINATES.length)];
    const shipCount = Math.floor(Math.random() * 3) + 1; // 1-3 кораблі
    
    const newPirateFleet = {
        name: `Піратський загін ${Date.now().toString().slice(-4)}`,
        type: 'pirate',
        ships: [{
            shipIndex: 0,
            projectName: template.name,
            shipLevel: template.shipLevel,
            weaponsCount: template.weaponsCount,
            weaponLevel: template.weaponLevel,
            count: shipCount
        }],
        status: 'Патрулює',
        coordinates: coordinates,
        createdAt: new Date().toLocaleDateString('uk-UA')
    };
    
    fleetsData.fleets.push(newPirateFleet);
    
    // Зберігаємо оновлені флоти
    try {
        fs.writeFileSync(fleetsPath, JSON.stringify(fleetsData, null, 2));
        console.log(`✅ Додано піратський флот "${newPirateFleet.name}" на орбіту ${coordinates}`);
    } catch (e) {
        console.error('Помилка збереження піратського флоту:', e);
    }
}

// Запускаємо генерацію піратських флотів кожну хвилину
setInterval(() => {
    generatePirateFleet();
}, 60000); // 60000 мс = 1 хвилина

// Початкова генерація при запуску сервера
console.log('Запуск генерації піратських флотів...');
generatePirateFleet();

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Or access it from other devices on your network at http://[YOUR_IP]:${PORT}`);
});