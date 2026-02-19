// Вікно списку планет

document.addEventListener('DOMContentLoaded', function() {
    const planetBtn = document.querySelectorAll('#buttons button')[1];
    const planetWindow = document.getElementById('planet-window');

    if (planetBtn && planetWindow) {
        planetBtn.addEventListener('click', function() {
            if (planetWindow.style.display === 'none' || planetWindow.style.display === '') {
                planetWindow.style.display = 'block';
                window.renderPlanetList && window.renderPlanetList();
            } else {
                planetWindow.style.display = 'none';
            }
        });

        // Додаємо обробник для кнопки закриття
        const closeBtn = planetWindow.querySelector('.planet-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                planetWindow.style.display = 'none';
            });
        }

        // Додаємо можливість рухати вікно мишкою
        let isDragging = false, offsetX = 0, offsetY = 0;

        planetWindow.querySelector('.planet-window-header').addEventListener('mousedown', function(e) {
            // Дозволяємо рухати за заголовок вікна
            isDragging = true;
            offsetX = e.clientX - planetWindow.offsetLeft;
            offsetY = e.clientY - planetWindow.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                planetWindow.style.left = (e.clientX - offsetX) + 'px';
                planetWindow.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
});
