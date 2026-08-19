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

        // Додаємо можливість перетягування
        makeDraggable(mapWindow);
    }
});