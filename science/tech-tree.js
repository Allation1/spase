// Файл відповідає за динамічне відкриття/закриття вікна науки

document.addEventListener('DOMContentLoaded', function() {
    const scienceBtn = document.getElementById('science-btn');
    const scienceWindow = document.getElementById('science-window');

    if (scienceBtn && scienceWindow) {
        scienceBtn.addEventListener('click', function() {
            // Перемикаємо видимість вікна науки
            if (scienceWindow.style.display === 'none' || scienceWindow.style.display === '') {
                if (window.renderScienceBlocks) window.renderScienceBlocks(); // Додаємо цей рядок
            } else {
                scienceWindow.style.display = 'none';
            }
        });
    }
});