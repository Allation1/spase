// Файл для зберігання даних наук

// Об'єкт для зберігання поточних рівнів наук
let scienceLevels = {};

// Функція для отримання поточного рівня науки
function getScienceLevel(scienceId) {
    return scienceLevels[scienceId] || 0;
}

// Функція для отримання всіх рівнів наук
function getAllScienceLevels() {
    return scienceLevels;
}

// Функція для встановлення рівня науки
function setScienceLevel(scienceId, level) {
    console.log(`Встановлюємо рівень ${level} для науки ${scienceId}`);
    scienceLevels[scienceId] = level;
    // Автоматично зберігаємо зміни
    saveScienceData();
}

// Функція для збереження даних наук у файл
async function saveScienceData() {
    console.log('Зберігаємо рівні наук:', scienceLevels);

    try {
        const response = await fetch('/api/save-science-levels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scienceLevels)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Рівні наук збережено успішно:', result);

        // Також зберігаємо в localStorage як резерв
        localStorage.setItem('scienceLevels', JSON.stringify(scienceLevels));
    } catch (error) {
        console.error('Помилка при збереженні даних наук:', error);
        // Якщо не вдалося зберегти на сервері, зберігаємо в localStorage як резерв
        localStorage.setItem('scienceLevels', JSON.stringify(scienceLevels));
    }
}

// Функція для завантаження даних наук з файлу
async function loadScienceData() {
    try {
        const response = await fetch('/science/science-levels.json');
        if (response.ok) {
            scienceLevels = await response.json();
        } else {
            // Якщо не вдалося завантажити з файлу, спробуємо з localStorage
            const savedData = localStorage.getItem('scienceLevels');
            if (savedData) {
                scienceLevels = JSON.parse(savedData);
            } else {
                // Якщо немає збережених даних, встановлюємо всі науки до 0 рівня
                const knownScienceIds = ['physics', 'chemistry', 'biology', 'geology', 'geometry', 'astronomy', 'materials', 'hydrogeology', 'construction', 'dendrology', 'forestry', 'petrology', 'stonework', 'building_center', 'building_source', 'stone_quarry_science', 'wood_cutting_science', 'building_house', 'building_warehouse'];
                knownScienceIds.forEach(id => {
                    scienceLevels[id] = 0;
                });
            }
        }
    } catch (error) {
        console.error('Помилка при завантаженні даних наук:', error);
        // Якщо не вдалося завантажити з файлу, спробуємо з localStorage
        const savedData = localStorage.getItem('scienceLevels');
        if (savedData) {
            scienceLevels = JSON.parse(savedData);
        } else {
            // Якщо немає збережених даних, встановлюємо всі науки до 0 рівня
            const knownScienceIds = ['physics', 'chemistry', 'biology', 'geology', 'geometry', 'astronomy', 'materials', 'hydrogeology'];
            knownScienceIds.forEach(id => {
                scienceLevels[id] = 0;
            });
        }
    }
}


// Завантажуємо дані при завантаженні скрипта
loadScienceData();

// Експортуємо функції для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getScienceLevel,
        getAllScienceLevels,
        setScienceLevel,
        saveScienceData,
        loadScienceData
    };
} else {
    window.scienceDataManager = {
        getScienceLevel,
        getAllScienceLevels,
        setScienceLevel,
        saveScienceData,
        loadScienceData
    };
}