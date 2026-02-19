// Файл для генерації ресурсів

// Функція для розрахунку базової генерації ресурсів
function calculateBasicResourceGeneration() {
    // Базова генерація - 1 одиниця кожного ресурсу за секунду
    return {
        'Населення': 1,
        'Вода': 1,
        'Деревина': 1,
        'Каміння': 1
    };
}

// Функція для розрахунку загальної генерації ресурсів з урахуванням будівель
function calculateTotalResourceGeneration(buildingsData) {
    // Отримуємо базову генерацію
    const basicGeneration = calculateBasicResourceGeneration();
    
    // Поки що повертаємо тільки базову генерацію
    // У майбутньому тут можна додати вплив будівель на генерацію
    return basicGeneration;
}

// Експортуємо функції для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateBasicResourceGeneration,
        calculateTotalResourceGeneration
    };
} else {
    window.resourceGenerator = {
        calculateBasicResourceGeneration,
        calculateTotalResourceGeneration
    };
}