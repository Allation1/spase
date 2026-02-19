import { planets } from './planet-data.js';

export function renderPlanetList() {
    const listContainer = document.getElementById('planet-list');
    if (!listContainer) {
        console.error('Елемент #planet-list не знайдено');
        return;
    }
    
    listContainer.innerHTML = '';
    planets.forEach(planet => {
        const item = document.createElement('div');
        item.className = 'planet-list-item';
        item.textContent = planet.name;
        item.style.cursor = 'pointer';
        
        // Додаємо обробник тільки для Тера
        if (planet.id === 'terra') {
            item.onclick = function() {
                console.log('Натиснуто на планету Тера');
                
                // Викликаємо нове вікно для Тера
                const checkAndExecute = () => {
                    console.log('Перевірка наявності функції renderTeraWindow...');

                    if (typeof window.renderTeraWindow === 'function') {
                        console.log('Функція renderTeraWindow знайдена, викликаємо її');
                        window.renderTeraWindow();
                    } else {
                        console.log('Функція renderTeraWindow не знайдена, повторна перевірка через 100 мс');

                        // Якщо функція ще не доступна, перевіряємо ще раз через 100 мс
                        setTimeout(checkAndExecute, 100);
                    }
                };
                
                checkAndExecute();
            };
        }
        
        listContainer.appendChild(item);
    });
}

// Для глобального виклику
window.renderPlanetList = renderPlanetList;