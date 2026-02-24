// Бойова система - нова версія зі спрощеним керуванням
let battleData = null;
let selectedShip = null;
let roundTimer = null;

// Черги дій
let autoMoveTargets = {};  // { shipIndex: {toX, toY} } - автоматичне переміщення до цілі
let targetedEnemies = {};  // { shipIndex: targetShipIndex } - прицілювання

// Константи
const GRID_SIZE = 25;
const ATTACK_RANGE = 10;
const MOVE_SPEED = 1;

// Ініціалізація бою
async function initBattle(attackerIndex, defenderIndex) {
    console.log('=== initBattle: ПОЧАТОК ===');

    // Завантажуємо флоти
    let fleetsData = { fleets: [] };
    try {
        const response = await fetch('/planets/fleets.json');
        if (response.ok) {
            fleetsData = await response.json();
        }
    } catch (e) {
        console.error('Помилка при отриманні флотів:', e);
        alert('Помилка завантаження флотів');
        return;
    }

    const attacker = fleetsData.fleets[attackerIndex];
    const defender = fleetsData.fleets[defenderIndex];

    if (!attacker || !defender) {
        alert('Флот не знайдено');
        return;
    }

    // Створюємо дані бою
    battleData = {
        attacker: attackerIndex,
        defender: defenderIndex,
        attackerName: attacker.name,
        defenderName: defender.name,
        attackerShips: JSON.parse(JSON.stringify(attacker.ships)),
        defenderShips: JSON.parse(JSON.stringify(defender.ships)),
        grid: createInitialGrid(attacker.ships, defender.ships),
        round: 1,
        roundTimeLeft: 60,
        logs: [],
        actions: [],
        autoMoveTargets: {},
        targetedEnemies: {}
    };

    // Зберігаємо бій
    await saveBattle();

    // Відображаємо поле бою
    renderBattle();
    startRoundTimer();
    addLog('Бій почався! ' + attacker.name + ' проти ' + defender.name, 'normal');

    console.log('=== initBattle: КІНЕЦЬ ===');
}

// Створення початкової сітки
function createInitialGrid(attackerShips, defenderShips) {
    const grid = [];

    // Гравець зліва (лінії 0-4)
    attackerShips.forEach((ship, index) => {
        const hpPerShip = ship.shipLevel * 10;
        const totalHP = (ship.count || 1) * hpPerShip;
        const x = index % 5;
        const y = Math.floor(index / 5) + 10;

        grid.push({
            x: x,
            y: y,
            shipIndex: index,
            side: 'player',
            count: ship.count || 1,
            currentHP: totalHP,
            maxHP: totalHP,
            ...ship
        });
    });

    // Противник справа (лінії 15-19)
    defenderShips.forEach((ship, index) => {
        const hpPerShip = ship.shipLevel * 10;
        const totalHP = (ship.count || 1) * hpPerShip;
        const x = 15 + (index % 5);
        const y = Math.floor(index / 5) + 10;

        grid.push({
            x: x,
            y: y,
            shipIndex: index,
            side: 'enemy',
            count: ship.count || 1,
            currentHP: totalHP,
            maxHP: totalHP,
            ...ship
        });
    });

    return grid;
}

// Відображення поля бою
function renderBattle() {
    if (!battleData) return;

    // Оновлюємо інформацію
    document.getElementById('battle-round').textContent = 'Раунд: ' + battleData.round;
    document.getElementById('battle-timer').textContent = 'Час: ' + battleData.roundTimeLeft + 'с';

    // Рендеримо сітку
    renderGrid();

    // Рендеримо панелі кораблів
    renderShipPanels();

    // Рендеримо логи
    renderLogs();

    // Малюємо стрілки та лінії
    renderOverlay();
}

// Рендер сітки
function renderGrid() {
    const gridContainer = document.getElementById('battle-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;

            // Перевіряємо, чи є корабель у цій клітинці
            const ship = battleData.grid.find(s => {
                const xMatch = s.x === x;
                const yMatch = s.y === y;
                const countMatch = s.count > 0;
                const hpMatch = (s.currentHP || (s.count * s.shipLevel * 10)) > 0;
                return xMatch && yMatch && countMatch && hpMatch;
            });

            if (ship) {
                cell.classList.add('ship');
                cell.classList.add(ship.side);
                cell.textContent = ship.side === 'player' ? '🔵' : '🔴';
                cell.title = `${ship.projectName} (HP: ${ship.currentHP})`;

                // Підсвітка обраного корабля
                if (selectedShip === ship) {
                    cell.classList.add('selected');
                }

                // Підсвітка цілі атаки
                if (targetedEnemies[ship.shipIndex]) {
                    cell.classList.add('targeted');
                }

                // Клік на ворожий корабель для прицілювання
                if (selectedShip && selectedShip.side === 'player' && ship.side === 'enemy') {
                    cell.style.cursor = 'crosshair';
                    cell.onclick = (e) => {
                        e.stopPropagation();
                        selectTarget(ship);
                    };
                }
            }

            // Підсвітка для обраного корабля
            if (selectedShip && selectedShip.side === 'player' && !ship) {
                const shipMoveTarget = autoMoveTargets[selectedShip.shipIndex];
                
                // Перевіряємо чи це кінцева ціль авто-руху
                if (shipMoveTarget && shipMoveTarget.toX === x && shipMoveTarget.toY === y) {
                    cell.classList.add('valid-move');
                    cell.style.background = 'rgba(245, 158, 11, 0.5)'; // Помаранчевий для цілі
                    cell.onclick = () => clearMoveTarget(selectedShip);
                } else {
                    // Будь-яка вільна клітинка - потенційна ціль
                    cell.classList.add('valid-move');
                    cell.onclick = () => setMoveTarget(selectedShip, x, y);
                }
            }

            gridContainer.appendChild(cell);
        }
    }
}

// Рендер панелей кораблів
function renderShipPanels() {
    const playerPanel = document.getElementById('player-ships');
    const enemyPanel = document.getElementById('enemy-ships');

    if (!playerPanel || !enemyPanel) return;

    playerPanel.innerHTML = '';
    enemyPanel.innerHTML = '';

    // Фільтруємо тільки кораблі з count > 0 і currentHP > 0
    battleData.grid.filter(s => {
        const hp = s.currentHP || (s.count * s.shipLevel * 10);
        return s.side === 'player' && s.count > 0 && hp > 0;
    }).forEach(ship => {
        const hpPerShip = ship.shipLevel * 10;
        const totalHP = ship.currentHP || (ship.count * hpPerShip);
        const div = document.createElement('div');
        div.className = 'ship-item' + (selectedShip === ship ? ' selected' : '');
        div.innerHTML = `
            <div class="ship-name">🔵 ${ship.projectName}</div>
            <div class="ship-stats">
                <div>Кораблів: <span style="color: #f59e0b; font-weight: bold;">${ship.count}</span></div>
                <div>Рівень: ${ship.shipLevel}</div>
                <div>Гармати: ${ship.weaponsCount} (рівень ${ship.weaponLevel})</div>
                <div class="ship-hp">💚 HP: <span style="color: #4ade80;">${totalHP}</span></div>
            </div>
        `;
        div.onclick = (e) => {
            e.stopPropagation();
            selectPlayerShip(ship);
        };
        playerPanel.appendChild(div);
    });

    // Фільтруємо тільки кораблі з count > 0 і currentHP > 0
    battleData.grid.filter(s => {
        const hp = s.currentHP || (s.count * s.shipLevel * 10);
        return s.side === 'enemy' && s.count > 0 && hp > 0;
    }).forEach(ship => {
        const hpPerShip = ship.shipLevel * 10;
        const totalHP = ship.currentHP || (ship.count * hpPerShip);
        const div = document.createElement('div');
        div.className = 'ship-item enemy';
        div.innerHTML = `
            <div class="ship-name">🔴 ${ship.projectName}</div>
            <div class="ship-stats">
                <div>Кораблів: <span style="color: #f59e0b; font-weight: bold;">${ship.count}</span></div>
                <div class="ship-hp">❤️ HP: <span style="color: #ef4444;">${totalHP}</span></div>
            </div>
        `;
        div.onclick = (e) => {
            e.stopPropagation();
            if (selectedShip && selectedShip.side === 'player') {
                selectTarget(ship);
            }
        };
        enemyPanel.appendChild(div);
    });
}

// Рендер логів
function renderLogs() {
    const logsContainer = document.getElementById('logs-container');
    logsContainer.innerHTML = battleData.logs.map(log =>
        `<div class="log-entry ${log.type}">[${log.round}] ${log.message}</div>`
    ).join('');
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Рендер SVG overlay (стрілки та лінії)
function renderOverlay() {
    const svg = document.getElementById('battle-overlay');
    if (!svg) return;

    const cellSize = 25;
    const gap = 1;
    const padding = 5;
    const totalSize = GRID_SIZE * (cellSize + gap) + padding * 2;

    svg.setAttribute('width', totalSize);
    svg.setAttribute('height', totalSize);
    svg.innerHTML = '';

    // Малюємо стрілки переміщення
    for (const [shipIndex, target] of Object.entries(autoMoveTargets)) {
        const ship = battleData.grid.find(s => s.shipIndex == shipIndex && s.side === 'player');
        if (!ship) continue;

        const fromX = ship.x * (cellSize + gap) + padding + cellSize / 2;
        const fromY = ship.y * (cellSize + gap) + padding + cellSize / 2;
        const toX = target.toX * (cellSize + gap) + padding + cellSize / 2;
        const toY = target.toY * (cellSize + gap) + padding + cellSize / 2;

        // Пунктирна лінія до кінцевої цілі
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        path.setAttribute('x1', fromX);
        path.setAttribute('y1', fromY);
        path.setAttribute('x2', toX);
        path.setAttribute('y2', toY);
        path.setAttribute('stroke', '#4ade80');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '5,5');
        path.setAttribute('opacity', '0.6');
        svg.appendChild(path);

        // Стрілка на кінці
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const arrowSize = 8;
        const arrowX = toX - Math.cos(angle) * (cellSize / 2 - 5);
        const arrowY = toY - Math.sin(angle) * (cellSize / 2 - 5);

        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('d', `M ${arrowX} ${arrowY} L ${arrowX - arrowSize * Math.cos(angle - Math.PI / 6)} ${arrowY - arrowSize * Math.sin(angle - Math.PI / 6)} M ${arrowX} ${arrowY} L ${arrowX - arrowSize * Math.cos(angle + Math.PI / 6)} ${arrowY - arrowSize * Math.sin(angle + Math.PI / 6)}`);
        arrowPath.setAttribute('stroke', '#4ade80');
        arrowPath.setAttribute('stroke-width', '2');
        arrowPath.setAttribute('fill', 'none');
        svg.appendChild(arrowPath);
    }

    // Малюємо лінії прицілювання
    for (const [shipIndex, targetIndex] of Object.entries(targetedEnemies)) {
        const ship = battleData.grid.find(s => s.shipIndex == shipIndex && s.side === 'player');
        const target = battleData.grid.find(s => s.shipIndex == targetIndex && s.side === 'enemy');
        if (!ship || !target) continue;

        const fromX = ship.x * (cellSize + gap) + padding + cellSize / 2;
        const fromY = ship.y * (cellSize + gap) + padding + cellSize / 2;
        const toX = target.x * (cellSize + gap) + padding + cellSize / 2;
        const toY = target.y * (cellSize + gap) + padding + cellSize / 2;

        // Перевіряємо дистанцію
        const distance = Math.abs(ship.x - target.x) + Math.abs(ship.y - target.y);
        const color = distance <= ATTACK_RANGE ? '#ef4444' : '#f59e0b';
        const opacity = distance <= ATTACK_RANGE ? '0.8' : '0.4';

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromX);
        line.setAttribute('y1', fromY);
        line.setAttribute('x2', toX);
        line.setAttribute('y2', toY);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '1');
        line.setAttribute('opacity', opacity);
        svg.appendChild(line);

        // Приціл на цілі
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', toX);
        circle.setAttribute('cy', toY);
        circle.setAttribute('r', '8');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('opacity', opacity);
        svg.appendChild(circle);
    }
}

// Вибір корабля гравця
function selectPlayerShip(ship) {
    console.log('selectPlayerShip:', ship);

    if (selectedShip === ship) {
        // Зняти виділення
        selectedShip = null;
    } else {
        selectedShip = ship;
    }

    renderGrid();
    renderShipPanels();
    renderOverlay();

    if (selectedShip) {
        addLog(`Обрано: ${ship.projectName} на позиції (${ship.x}:${ship.y})`, 'normal');
    }
}

// Встановлення цілі переміщення
function setMoveTarget(ship, toX, toY) {
    // Встановлюємо як кінцеву ціль для авто-руху
    autoMoveTargets[ship.shipIndex] = { toX, toY };
    addLog(`${ship.projectName} прямує до (${toX}:${toY})`, 'move');
    renderGrid();
    renderShipPanels();
    renderOverlay();
    saveBattle();
}

// Очищення цілі переміщення
function clearMoveTarget(ship) {
    delete autoMoveTargets[ship.shipIndex];
    addLog(`${ship.projectName} скасовано рух`, 'normal');
    renderGrid();
    renderOverlay();
    saveBattle();
}

// Переміщення корабля
async function moveShip(ship, toX, toY) {
    // Перевірка чи вільна клітинка
    const shipInCell = battleData.grid.find(s => 
        s.x === toX && 
        s.y === toY && 
        s.count > 0 && 
        s !== ship
    );

    if (shipInCell) {
        addLog('Клітинка зайнята!', 'normal');
        return;
    }

    const oldX = ship.x;
    const oldY = ship.y;

    ship.x = toX;
    ship.y = toY;

    addLog(`${ship.projectName} (${oldX}:${oldY}) → перемістився на (${toX}:${toY})`, 'move');

    renderGrid();
    renderShipPanels();
    renderOverlay();

    await saveBattle();
}

// Вибір цілі для атаки
function selectTarget(enemyShip) {
    if (!selectedShip || selectedShip.side !== 'player') {
        addLog('Спочатку оберіть свій корабель!', 'normal');
        return;
    }

    const distance = Math.abs(selectedShip.x - enemyShip.x) + Math.abs(selectedShip.y - enemyShip.y);

    // Додаємо/видаляємо з прицілу
    if (targetedEnemies[selectedShip.shipIndex] === enemyShip.shipIndex) {
        // Вже в прицілі - скасовуємо
        delete targetedEnemies[selectedShip.shipIndex];
        addLog(`${selectedShip.projectName} зняв з прицілу ${enemyShip.projectName}`, 'normal');
    } else {
        // Ставимо в приціл
        targetedEnemies[selectedShip.shipIndex] = enemyShip.shipIndex;
        const status = distance <= ATTACK_RANGE ? 'готова до атаки' : 'тримає в прицілі';
        addLog(`${selectedShip.projectName} ${status}: ${enemyShip.projectName} (дистанція: ${distance})`, 'target');
    }

    renderGrid();
    renderShipPanels();
    renderOverlay();
    saveBattle();
}

// Скасування всіх дій
function clearAllActions() {
    autoMoveTargets = {};
    targetedEnemies = {};
    selectedShip = null;
    addLog('Всі дії скасовано', 'normal');
    renderGrid();
    renderShipPanels();
    renderOverlay();
    saveBattle();
}

// Виконання переміщень
async function executeMoves() {
    for (const [shipIndex, target] of Object.entries(autoMoveTargets)) {
        const ship = battleData.grid.find(s => s.shipIndex == shipIndex && s.side === 'player');
        if (!ship) {
            delete autoMoveTargets[shipIndex];
            continue;
        }

        // Перевіряємо чи досягнуто цілі
        if (ship.x === target.toX && ship.y === target.toY) {
            addLog(`${ship.projectName} досягнуто цілі (${target.toX}:${target.toY})`, 'normal');
            delete autoMoveTargets[shipIndex];
            continue;
        }

        // Обчислюємо напрямок руху (з діагоналлю)
        let dx = 0, dy = 0;
        if (ship.x < target.toX) dx = 1;
        else if (ship.x > target.toX) dx = -1;
        
        if (ship.y < target.toY) dy = 1;
        else if (ship.y > target.toY) dy = -1;

        const newX = ship.x + dx;
        const newY = ship.y + dy;

        // Перевірка чи вільна клітинка
        const shipInCell = battleData.grid.find(s => 
            s.x === newX && 
            s.y === newY && 
            s.count > 0 && 
            s !== ship
        );

        if (!shipInCell) {
            await moveShip(ship, newX, newY);
        } else {
            addLog(`${ship.projectName} заблоковано на шляху до цілі`, 'normal');
        }
    }
}

// Виконання атак
async function executeAttacks() {
    for (const [shipIndex, targetIndex] of Object.entries(targetedEnemies)) {
        const ship = battleData.grid.find(s => s.shipIndex == shipIndex && s.side === 'player');
        const target = battleData.grid.find(s => s.shipIndex == targetIndex && s.side === 'enemy');

        if (!ship || !target || ship.count <= 0 || target.count <= 0) {
            delete targetedEnemies[shipIndex];
            continue;
        }

        const distance = Math.abs(ship.x - target.x) + Math.abs(ship.y - target.y);

        // Атака тільки якщо в радіусі
        if (distance <= ATTACK_RANGE) {
            await performAttack(ship, target);
        } else {
            addLog(`${ship.projectName} не може атакувати ${target.projectName} - занадто далеко (${distance} > ${ATTACK_RANGE})`, 'normal');
        }
    }
}

// Виконання атаки
async function performAttack(attacker, target) {
    const totalGuns = attacker.count * attacker.weaponsCount;
    const totalDamage = totalGuns * attacker.weaponLevel;

    addLog(`${attacker.projectName} атакує ${target.projectName} (урон: ${totalDamage})`, 'attack');

    const hpPerShip = target.shipLevel * 10;
    const oldHP = target.currentHP;

    target.currentHP = Math.max(0, target.currentHP - totalDamage);
    const damageDealt = oldHP - target.currentHP;

    // Якщо HP <= 0, зменшуємо кількість кораблів
    if (target.currentHP <= 0) {
        const shipsLost = Math.ceil(Math.abs(target.currentHP) / hpPerShip) + 1;
        target.count = Math.max(0, target.count - shipsLost);
        target.currentHP = target.count * hpPerShip;

        if (target.count <= 0) {
            addLog(`${target.projectName} знищено!`, 'destroy');
            // Видаляємо корабель з сітки бою
            battleData.grid = battleData.grid.filter(s => s !== target);
            delete targetedEnemies[attacker.shipIndex];

            // Перевірка перемоги
            await checkBattleEnd();
        } else {
            addLog(`${target.projectName} втратив ${shipsLost} кораблів`, 'damage');
        }
    } else {
        addLog(`${target.projectName} отримав ${damageDealt} урону`, 'damage');
    }

    renderGrid();
    renderShipPanels();
    renderOverlay();
}

// Перевірка завершення бою
async function checkBattleEnd() {
    const enemyShips = battleData.grid.filter(s => {
        const hp = s.currentHP || (s.count * s.shipLevel * 10);
        return s.side === 'enemy' && s.count > 0 && hp > 0;
    });

    const playerShips = battleData.grid.filter(s => {
        const hp = s.currentHP || (s.count * s.shipLevel * 10);
        return s.side === 'player' && s.count > 0 && hp > 0;
    });

    if (enemyShips.length === 0) {
        setTimeout(async () => {
            alert('🎉 ПЕРЕМОГА! Всі ворожі флоти знищено!');
            if (roundTimer) clearInterval(roundTimer);
            
            // Видаляємо піратський флот з fleets.json
            await deleteEnemyFleet();
            
            fetch('/api/save-battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeBattle: null })
            }).then(() => {
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            });
        }, 100);
        return true;
    }

    if (playerShips.length === 0) {
        setTimeout(() => {
            alert('💥 ПОРАЗКА! Всі ваші флоти знищено!');
            if (roundTimer) clearInterval(roundTimer);
            fetch('/api/save-battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeBattle: null })
            }).then(() => {
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            });
        }, 100);
        return true;
    }

    return false;
}

// Видалення ворожого флоту після перемоги
async function deleteEnemyFleet() {
    try {
        // Отримуємо всі флоти
        const response = await fetch('/planets/fleets.json');
        if (!response.ok) return;
        
        const fleetsData = await response.json();
        
        // Знаходимо флот противника за індексом
        const defenderIndex = battleData.defender;
        if (defenderIndex >= 0 && defenderIndex < fleetsData.fleets.length) {
            // Видаляємо флот з масиву
            fleetsData.fleets.splice(defenderIndex, 1);
            
            // Зберігаємо оновлений список флотів
            await fetch('/api/save-fleets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fleetsData)
            });
            
            console.log('Флот противника видалено:', defenderIndex);
        }
    } catch (e) {
        console.error('Помилка видалення флоту:', e);
    }
}

// Завершення раунду
async function endRound() {
    console.log('=== endRound: ВИКЛИКАНО ===');

    // 1. Спочатку виконуємо всі переміщення
    await executeMoves();

    // 2. Потім виконуємо всі атаки
    await executeAttacks();

    // Перевірка завершення бою
    const ended = await checkBattleEnd();
    if (ended) return;

    // 3. Новий раунд
    battleData.round++;
    battleData.roundTimeLeft = 60;

    addLog(`=== Раунд ${battleData.round} ===`, 'normal');

    await saveBattle();
    renderBattle();
    startRoundTimer();
}

// Таймер раунду
function startRoundTimer() {
    if (roundTimer) clearInterval(roundTimer);

    roundTimeLeft = battleData.roundTimeLeft || 60;

    roundTimer = setInterval(async () => {
        battleData.roundTimeLeft--;
        document.getElementById('battle-timer').textContent = 'Час: ' + battleData.roundTimeLeft + 'с';

        // Зберігаємо бій кожні 5 секунд
        if (battleData.roundTimeLeft % 5 === 0) {
            await saveBattle();
        }

        if (battleData.roundTimeLeft <= 0) {
            endRound();
        }
    }, 1000);
}

// Додавання запису в логи
function addLog(message, type = 'normal') {
    battleData.logs.push({
        round: battleData.round,
        message: message,
        type: type
    });
    renderLogs();
}

// Збереження бою
async function saveBattle() {
    console.log('saveBattle: збереження бою');

    const battleToSave = {
        ...battleData,
        autoMoveTargets: autoMoveTargets,
        targetedEnemies: targetedEnemies
    };

    try {
        const response = await fetch('/api/save-battle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activeBattle: battleToSave })
        });

        if (response.ok) {
            console.log('saveBattle: збережено успішно');
        }
    } catch (e) {
        console.error('saveBattle: помилка:', e);
    }
}

// Вихід з бою
function exitBattle() {
    if (confirm('Завершити бій?')) {
        window.location.href = '/';
    }
}

// Завантаження бою при відкритті
async function loadBattle() {
    console.log('loadBattle: початок');

    try {
        const response = await fetch('/battle/battle.json');
        if (response.ok) {
            const data = await response.json();
            if (data.activeBattle && data.activeBattle.grid && data.activeBattle.grid.length > 0) {
                battleData = data.activeBattle;
                
                // Відновлюємо збережені дії
                autoMoveTargets = data.activeBattle.autoMoveTargets || {};
                targetedEnemies = data.activeBattle.targetedEnemies || {};
                
                console.log('Відновлено авто-рух:', autoMoveTargets);
                console.log('Відновлено приціли:', targetedEnemies);
                
                renderBattle();
                startRoundTimer();
                return;
            }
        }
    } catch (e) {
        console.error('Помилка завантаження бою:', e);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const attacker = urlParams.get('attacker');
    const defender = urlParams.get('defender');

    if (attacker && defender) {
        await initBattle(parseInt(attacker), parseInt(defender));
    } else {
        alert('Бій не знайдено!');
    }
}

// Експорт функцій
window.initBattle = initBattle;
window.exitBattle = exitBattle;
window.clearAllActions = clearAllActions;
window.endRound = endRound;

// Завантажуємо бій при відкритті
if (window.location.pathname.includes('battle.html')) {
    loadBattle();
}
