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
        timerWindow.style.right = '10px';
        timerWindow.style.background = '#0e3a47';
        timerWindow.style.border = '2px solid #1fa2c7';
        timerWindow.style.borderRadius = '4px';
        timerWindow.style.padding = '10px';
        timerWindow.style.zIndex = '300';
        timerWindow.style.color = 'white';
        timerWindow.style.fontFamily = 'monospace';
        timerWindow.style.minWidth = '200px';
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

        // Оновлюємо вміст вікна
        timerWindow.innerHTML = `
            <div>Вивчається: ${scienceName} (рівень ${data.currentLevel})</div>
            <div id="timer-display">00:00:${data.remainingTime.toString().padStart(2, '0')}</div>
            <button id="cancel-study-btn" style="
                background: #17607a;
                color: white;
                border: 1px solid #1fa2c7;
                border-radius: 4px;
                padding: 4px 8px;
                margin-top: 5px;
                cursor: pointer;
                width: 100%;
            ">Скасувати вивчення</button>
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
                    const hours = Math.floor(remainingTime / 3600);
                    const minutes = Math.floor((remainingTime % 3600) / 60);
                    const seconds = remainingTime % 60;
                    
                    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);

        // Додаємо обробник для кнопки скасування
        const cancelBtn = timerWindow.querySelector('#cancel-study-btn');
        if (cancelBtn) {
            cancelBtn.onclick = (e) => {
                e.stopPropagation(); // Запобігаємо впливу на інші обробники подій
                fetch('/api/cancel-study', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        scienceId: data.currentScience.id,
                        userId: 'current_user_id' // Тут має бути реальний ID користувача
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        console.log(`Вивчення науки ${data.currentScience.id} скасовано`);
                        // Зупиняємо таймер
                        if (studyTimerInterval) {
                            clearInterval(studyTimerInterval);
                            studyTimerInterval = null;
                        }
                        
                        // Оновлюємо вікно
                        timerWindow.innerHTML = `
                            <div>Вивчається: </div>
                            <div id="timer-display">00:00:00</div>
                        `;
                    } else {
                        console.error('Помилка при скасуванні вивчення:', result.message);
                    }
                })
                .catch(error => {
                    console.error('Помилка при відправці запиту на сервер:', error);
                });
            };
        }
    } else {
        // Якщо нічого не вивчається
        // Вікно вже існує, просто оновлюємо його вміст
        timerWindow.innerHTML = `
            <div>Вивчається: </div>
            <div id="timer-display">00:00:00</div>
        `;
    }
}

// Починаємо регулярно перевіряти статус вивчення
document.addEventListener('DOMContentLoaded', function() {
    setInterval(fetchStudyStatus, 5000); // Кожні 5 секунд
    fetchStudyStatus(); // Перевіряємо відразу після завантаження
});