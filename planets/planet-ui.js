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

// Обробник для кнопки відкриття та закриття вікна планет
function initPlanetUI() {
    const planetBtn = document.getElementById('planet-btn') || document.querySelectorAll('#buttons button')[1];
    const planetWindow = document.getElementById('planet-window');

    if (planetBtn && planetWindow) {
        // Уникаємо повторного додавання слухача, якщо ініціалізація викликана кілька разів
        if (!planetBtn.dataset.listenerAttached) {
            planetBtn.dataset.listenerAttached = 'true';
            planetBtn.addEventListener('click', function() {
                if (planetWindow.style.display === 'none' || planetWindow.style.display === '') {
                    planetWindow.style.display = 'block';
                    window.renderPlanetList(); // Рендеримо список планет
                    if (typeof bringWindowToFront === 'function') bringWindowToFront(planetWindow);
                    window.windowManager?.update('planet-window', true);
                } else {
                    planetWindow.style.display = 'none';
                    window.windowManager?.update('planet-window', false);
                }
            });
        }

        // Обробник для кнопки закриття
        const closeBtn = planetWindow.querySelector('.planet-close-btn');
        if (closeBtn && !closeBtn.dataset.listenerAttached) {
            closeBtn.dataset.listenerAttached = 'true';
            closeBtn.addEventListener('click', function() {
                planetWindow.style.display = 'none';
                window.windowManager?.update('planet-window', false);
            });
        }

        // Додаємо обробник для кнопки оновлення
        const refreshBtn = planetWindow.querySelector('.planet-refresh-btn');
        if (refreshBtn && !refreshBtn.dataset.listenerAttached) {
            refreshBtn.dataset.listenerAttached = 'true';
            refreshBtn.addEventListener('click', function() {
                window.renderPlanetList();
            });
        }

        // Додаємо можливість перетягування для вікна планет
        if (typeof window.makeDraggable === 'function') { 
            window.makeDraggable(planetWindow);
        } else {
            console.warn('makeDraggable function not found for planet-window.');
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlanetUI);
} else {
    initPlanetUI();
}