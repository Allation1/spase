// Бойова система
let battleData = null;
let selectedShip = null;
let currentMode = null; // 'move' or 'attack'
let roundTimer = null;
let roundTimeLeft = 60;

// Ініціалізація бою
async function initBattle(attackerIndex, defenderIndex) {
    console.log('initBattle:', attackerIndex, defenderIndex);
    
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
        actions: []
    };
    
    // Зберігаємо бій
    await saveBattle();
    
    // Відображаємо поле бою
    renderBattle();
    startRoundTimer();
    addLog('Бій почався! ' + attacker.name + ' проти ' + defender.name, 'normal');
}

// Створення початкової сітки
function createInitialGrid(attackerShips, defenderShips) {
    const grid = [];
    
    // Гравець зліва (лінії 0-4)
    attackerShips.forEach((ship, index) => {
        grid.push({
            x: index % 5,
            y: Math.floor(index / 5) + 10,
            shipIndex: index,
            side: 'player',
            ...ship
        });
    });
    
    // Противник справа (лінії 15-19)
    defenderShips.forEach((ship, index) => {
        grid.push({
            x: 15 + (index % 5),
            y: Math.floor(index / 5) + 10,
            shipIndex: index,
            side: 'enemy',
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
}

// Рендер сітки
function renderGrid() {
    const gridContainer = document.getElementById('battle-grid');
    gridContainer.innerHTML = '';
    
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // Перевіряємо, чи є корабель у цій клітинці
            const ship = battleData.grid.find(s => s.x === x && s.y === y && s.count > 0);
            if (ship) {
                cell.classList.add('ship');
                cell.classList.add(ship.side);
                cell.textContent = ship.side === 'player' ? '🔵' : '🔴';
                cell.title = `${ship.projectName} (HP: ${ship.shipLevel * 10})`;
            }
            
            // Підсвітка	valid moves
            if (currentMode === 'move' && selectedShip) {
                const dx = Math.abs(x - selectedShip.x);
                const dy = Math.abs(y - selectedShip.y);
                if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
                    cell.classList.add('valid-move');
                    cell.onclick = () => moveShip(x, y);
                }
            }
            
            // Підсвітка	valid targets
            if (currentMode === 'attack' && selectedShip) {
                const enemyShips = battleData.grid.filter(s => s.side === 'enemy' && s.count > 0);
                const enemyShip = enemyShips.find(s => s.x === x && s.y === y);
                if (enemyShip) {
                    const distance = Math.abs(selectedShip.x - x) + Math.abs(selectedShip.y - y);
                    if (distance <= 1) { // Дальність пострілу = 1
                        cell.classList.add('valid-target');
                        cell.onclick = () => selectTarget(enemyShip);
                    }
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
    
    playerPanel.innerHTML = '';
    enemyPanel.innerHTML = '';
    
    battleData.grid.filter(s => s.side === 'player' && s.count > 0).forEach(ship => {
        const hp = ship.shipLevel * 10;
        const div = document.createElement('div');
        div.className = 'ship-item' + (selectedShip === ship ? ' selected' : '');
        div.innerHTML = `
            <div class="ship-name">🔵 ${ship.projectName}</div>
            <div class="ship-stats">
                <div>Рівень: ${ship.shipLevel}</div>
                <div>Гармати: ${ship.weaponsCount} (рівень ${ship.weaponLevel})</div>
                <div class="ship-hp">HP: ${hp}</div>
            </div>
        `;
        div.onclick = () => selectPlayerShip(ship);
        playerPanel.appendChild(div);
    });
    
    battleData.grid.filter(s => s.side === 'enemy' && s.count > 0).forEach(ship => {
        const hp = ship.shipLevel * 10;
        const div = document.createElement('div');
        div.className = 'ship-item enemy';
        div.innerHTML = `
            <div class="ship-name">🔴 ${ship.projectName}</div>
            <div class="ship-stats">
                <div class="ship-hp">HP: ${hp}</div>
            </div>
        `;
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

// Вибір корабля гравця
function selectPlayerShip(ship) {
    if (currentMode) {
        selectedShip = ship;
        renderGrid();
        renderShipPanels();
        
        if (currentMode === 'move') {
            document.getElementById('ship-actions').style.display = 'none';
        } else if (currentMode === 'attack') {
            document.getElementById('attack-options').style.display = 'block';
        }
    }
}

// Режим переміщення
function showMoveMode() {
    currentMode = 'move';
    document.getElementById('ship-actions').style.display = 'block';
    document.getElementById('attack-options').style.display = 'none';
    addLog('Оберіть корабель для переміщення', 'normal');
}

// Режим атаки
function showAttackMode() {
    currentMode = 'attack';
    document.getElementById('ship-actions').style.display = 'block';
    document.getElementById('attack-options').style.display = 'none';
    addLog('Оберіть корабель для атаки', 'normal');
}

// Скасування дій
function cancelActions() {
    currentMode = null;
    selectedShip = null;
    document.getElementById('ship-actions').style.display = 'none';
    document.getElementById('attack-options').style.display = 'none';
    renderGrid();
    renderShipPanels();
}

// Переміщення корабля
async function moveShip(x, y) {
    if (!selectedShip) return;
    
    const oldX = selectedShip.x;
    const oldY = selectedShip.y;
    
    selectedShip.x = x;
    selectedShip.y = y;
    
    addLog(`${selectedShip.projectName} (${oldX}:${oldY}) → перемістився на (${x}:${y})`, 'move');
    
    cancelActions();
    renderGrid();
    renderShipPanels();
    
    await saveBattle();
}

// Вибір цілі
let targetShip = null;
function selectTarget(ship) {
    targetShip = ship;
    document.getElementById('attack-options').style.display = 'block';
}

// Закриття вікна вибору цілі
function closeTargetWindow() {
    document.getElementById('target-select-window').style.display = 'none';
}

// Збереження атаки
async function saveAttack() {
    if (!selectedShip || !targetShip) return;
    
    const attackType = document.querySelector('input[name="attack-type"]:checked').value;
    const damage = selectedShip.weaponsCount * selectedShip.weaponLevel;
    
    addLog(`${selectedShip.projectName} (${selectedShip.x}:${selectedShip.y}) → атакує ${targetShip.projectName} (${targetShip.x}:${targetShip.y})`, 'attack');
    
    if (attackType === 'single') {
        // Атака по одному
        targetShip.count -= damage;
        addLog(`${targetShip.projectName} отримав ${damage} урону (HP: ${(targetShip.shipLevel * 10) + targetShip.count}→${targetShip.shipLevel * 10 + Math.max(0, targetShip.count)})`, 'damage');
        
        if (targetShip.count <= 0) {
            addLog(`${targetShip.projectName} знищено!`, 'destroy');
        }
    } else {
        // Атака по всім
        const enemyShips = battleData.grid.filter(s => s.side === 'enemy' && s.count > 0);
        const damagePerShip = Math.floor(damage / enemyShips.length);
        
        enemyShips.forEach(ship => {
            ship.count -= damagePerShip;
            addLog(`${ship.projectName} отримав ${damagePerShip} урону`, 'damage');
            
            if (ship.count <= 0) {
                addLog(`${ship.projectName} знищено!`, 'destroy');
            }
        });
    }
    
    cancelActions();
    renderGrid();
    renderShipPanels();
    
    await saveBattle();
}

// Завершення раунду
async function endRound() {
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
    
    roundTimer = setInterval(() => {
        battleData.roundTimeLeft--;
        document.getElementById('battle-timer').textContent = 'Час: ' + battleData.roundTimeLeft + 'с';
        
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
}

// Збереження бою
async function saveBattle() {
    try {
        await fetch('/api/save-battle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activeBattle: battleData })
        });
    } catch (e) {
        console.error('Помилка збереження бою:', e);
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
    try {
        const response = await fetch('/battle/battle.json');
        if (response.ok) {
            const data = await response.json();
            if (data.activeBattle) {
                battleData = data.activeBattle;
                renderBattle();
                startRoundTimer();
            }
        }
    } catch (e) {
        console.error('Помилка завантаження бою:', e);
    }
}

// Експорт функцій
window.initBattle = initBattle;
window.exitBattle = exitBattle;
window.showMoveMode = showMoveMode;
window.showAttackMode = showAttackMode;
window.cancelActions = cancelActions;
window.moveShip = moveShip;
window.selectTarget = selectTarget;
window.closeTargetWindow = closeTargetWindow;
window.saveAttack = saveAttack;
window.endRound = endRound;

// Завантажуємо бій при відкритті
if (window.location.pathname.includes('battle.html')) {
    loadBattle();
}
