// Цей файл гарантує, що функції з модулів доступні глобально

// Очікуємо, що модуль вже завантажив функції
document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо, чи функції вже доступні
    if (typeof renderTeraWindow !== 'undefined') {
        window.renderTeraWindow = renderTeraWindow;
        console.log('Функція renderTeraWindow передана до глобального об\'єкта window');
    } else {
        console.warn('Функція renderTeraWindow не знайдена у поточному контексті');
        
        // Спробуємо імпортувати функцію з файлу
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
            import { renderTeraWindow } from './planets/tera/tera-window.js';
            window.renderTeraWindow = renderTeraWindow;
        `;
        document.head.appendChild(script);
    }
});