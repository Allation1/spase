document.addEventListener('DOMContentLoaded', function() {
    const mapBtn = document.querySelectorAll('#buttons button')[2];
    const mapWindow = document.getElementById('map-window');
    const mapTitle = mapWindow ? mapWindow.querySelector('.science-window-title') : null;

    if (mapBtn && mapWindow && mapTitle) {
        mapBtn.addEventListener('click', function() {
            if (mapWindow.style.display === 'none' || mapWindow.style.display === '') {
                mapWindow.style.display = 'block';
                window.renderSpaceMap && window.renderSpaceMap();
                bringWindowToFront(mapWindow);
            } else {
                mapWindow.style.display = 'none';
            }
        });

        // Перетягування тільки за шапку
        let isDragging = false, offsetX = 0, offsetY = 0;
        mapTitle.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - mapWindow.offsetLeft;
            offsetY = e.clientY - mapWindow.offsetTop;
            document.body.style.userSelect = 'none';
            // Піднімаємо вікно на передній план при кліку
            bringWindowToFront(mapWindow);
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                mapWindow.style.left = (e.clientX - offsetX) + 'px';
                mapWindow.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }
});