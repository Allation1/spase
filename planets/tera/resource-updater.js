// Файл для оновлення ресурсів на клієнті
// Зараз сервер автоматично оновлює ресурси, тому цей файл просто оновлює відображення

// Функція для оновлення відображення ресурсів
async function updateResourcesDisplay() {
    try {
        // Отримуємо поточні ресурси з сервера
        const response = await fetch('/api/resources');
        const resources = await response.json();

        // Якщо вікно планети відкрите, оновлюємо відображення
        if (window.updateTeraResources) {
            window.updateTeraResources();
        }

        console.log('Відображення ресурсів оновлено:', resources);
    } catch (error) {
        console.error('Помилка при оновленні відображення ресурсів:', error);
    }
}

// Оновлюємо відображення ресурсів кожні 2 секунди
function startResourceDisplayUpdates() {
    // Перевіряємо, чи вже запущено інтервал
    if (window.resourceDisplayUpdateInterval) {
        clearInterval(window.resourceDisplayUpdateInterval);
    }

    // Створюємо інтервал для оновлення відображення ресурсів кожні 2 секунди
    window.resourceDisplayUpdateInterval = setInterval(updateResourcesDisplay, 2000);

    console.log('Оновлення відображення ресурсів запущено (кожні 2 секунди)');
}

// Запускаємо оновлення відображення ресурсів
startResourceDisplayUpdates();

// Експортуємо функції для використання в інших файлах
window.resourceUpdater = {
    updateResourcesDisplay,
    startResourceDisplayUpdates
};