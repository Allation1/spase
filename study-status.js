// Файл для відстеження статусу вивчення наук

// Функція для отримання статусу вивчення з сервера
function fetchStudyStatus() {
    fetch('/api/study-status')
        .then(response => response.json())
        .then(data => {
            // Оновлюємо відображення статусу вивчення
            updateStudyDisplay(data);
        })
        .catch(error => {
            console.error('Помилка при отриманні статусу вивчення:', error);
        });
}

// Глобальна змінна для зберігання інтервалу таймера
let studyTimerInterval = null;

// Функція для оновлення відображення статусу вивчення
function updateStudyDisplay(data) {
    // Отримуємо або створюємо вікно таймера
    let timerWindow = document.getElementById('study-timer-window');

    if (!timerWindow) {
        // Якщо вікно таймера не існує, створюємо його
        timerWindow = document.createElement('div');
        timerWindow.id = 'study-timer-window';
        timerWindow.style.position = 'fixed';
        timerWindow.style.top = '10px';
        timerWindow.style.left = '50%';
        timerWindow.style.transform = 'translateX(-50%)';
        timerWindow.style.background = '#0e3a47';
        timerWindow.style.border = '2px solid #1fa2c7';
        timerWindow.style.borderRadius = '4px';
        timerWindow.style.padding = '5px 10px';
        timerWindow.style.zIndex = '300';
        timerWindow.style.color = 'white';
        timerWindow.style.fontFamily = 'monospace';
        timerWindow.style.minWidth = '250px';
        timerWindow.style.boxShadow = '2px 4px 16px rgba(0,0,0,0.3)';
        
        document.body.appendChild(timerWindow);
    }

    // Зупиняємо попередній таймер, якщо він існує
    if (studyTimerInterval) {
        clearInterval(studyTimerInterval);
        studyTimerInterval = null;
    }

    if (data.studying && data.currentScience) {
        // Якщо щось вивчається
        const scienceName = data.currentScience.name || data.currentScience.id || 'Невідома наука';

        const formatTime = (timeInSeconds) => {
            const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        };

        // Оновлюємо вміст вікна
        timerWindow.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                <img src="images/flask_32x32.png" alt="Наука" style="width: 32px; height: 32px;">
                <div id="study-name-display" style="background: #0e3a47; border: 1px solid #1fa2c7; padding: 5px 10px; border-radius: 4px; min-width: 150px; text-align: center;">${scienceName} (рівень ${data.currentLevel})</div>
                <div id="timer-display" style="background: #0e3a47; border: 1px solid #1fa2c7; padding: 5px 10px; border-radius: 4px; min-width: 80px; text-align: center;">${formatTime(data.remainingTime)}</div>
            </div>
        `;

        // Запускаємо таймер для оновлення відображення
        let remainingTime = data.remainingTime;
        studyTimerInterval = setInterval(() => {
            remainingTime--;
            
            if (remainingTime < 0) {
                remainingTime = 0;
                // Якщо час вийшов, оновлюємо відображення
                clearInterval(studyTimerInterval);
                studyTimerInterval = null;
                
                // Оновлюємо відображення, щоб показати, що нічого не вивчається
                fetch('/api/study-status')
                    .then(response => response.json())
                    .then(updatedData => {
                        updateStudyDisplay(updatedData);
                    })
                    .catch(error => {
                        console.error('Помилка при отриманні оновленого статусу вивчення:', error);
                    });
            } else {
                // Оновлюємо тільки таймер
                const timerDisplay = timerWindow.querySelector('#timer-display');
                if (timerDisplay) {
                    timerDisplay.textContent = formatTime(remainingTime);
                }
            }
        }, 1000);
    } else {
        // Якщо нічого не вивчається
        // Вікно вже існує, просто оновлюємо його вміст
        timerWindow.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                <img src="images/flask_32x32.png" alt="Наука" style="width: 32px; height: 32px; opacity: 0.5;">
                <div style="background: #0e3a47; border: 1px solid #1fa2c7; padding: 5px 10px; border-radius: 4px; min-width: 150px; text-align: center; color: #666;">Немає вивчення</div>
                <div style="background: #0e3a47; border: 1px solid #1fa2c7; padding: 5px 10px; border-radius: 4px; min-width: 80px; text-align: center; color: #666;">00:00:00</div>
            </div>
        `;
    }
}

// Починаємо регулярно перевіряти статус вивчення
document.addEventListener('DOMContentLoaded', function() {
    setInterval(fetchStudyStatus, 5000); // Кожні 5 секунд
    fetchStudyStatus(); // Перевіряємо відразу після завантаження
});