// Менеджер наукової системи

class ScienceManager {
    constructor() {
        this.sciences = [
            { id: 'physics', name: 'Фізика', description: 'Вивчення матерії, енергії та їх взаємодії' },
            { id: 'chemistry', name: 'Хімія', description: 'Вивчення речовин та їх перетворень' },
            { id: 'biology', name: 'Біологія', description: 'Вивчення живих організмів' },
            { id: 'geometry', name: 'Геометрія', description: 'Вивчення просторових форм та відносин' },
            { id: 'astronomy', name: 'Астрономія', description: 'Вивчення небесних тіл та космосу' },
            { id: 'materials', name: 'Матеріалознавство', description: 'Вивчення властивостей матеріалів' }
        ];
        
        this.researchedSciences = new Set();
        this.currentResearch = null;
        this.researchProgress = 0;
    }

    // Отримати список всіх наук
    getAllSciences() {
        return this.sciences;
    }

    // Розпочати дослідження науки
    startResearch(scienceId) {
        const science = this.sciences.find(s => s.id === scienceId);
        if (science && !this.researchedSciences.has(scienceId)) {
            this.currentResearch = science;
            this.researchProgress = 0;
            return true;
        }
        return false;
    }

    // Оновити прогрес дослідження
    updateResearchProgress(amount) {
        if (this.currentResearch) {
            this.researchProgress += amount;
            if (this.researchProgress >= 100) {
                this.completeResearch();
            }
        }
    }

    // Завершити дослідження
    completeResearch() {
        if (this.currentResearch) {
            this.researchedSciences.add(this.currentResearch.id);
            this.currentResearch = null;
            this.researchProgress = 0;
        }
    }

    // Перевірити, чи завершено дослідження
    isResearchCompleted(scienceId) {
        return this.researchedSciences.has(scienceId);
    }

    // Отримати прогрес дослідження
    getResearchProgress(scienceId) {
        if (this.currentResearch && this.currentResearch.id === scienceId) {
            return this.researchProgress;
        }
        return this.isResearchCompleted(scienceId) ? 100 : 0;
    }
}

// Створюємо глобальний екземпляр менеджера наук
window.scienceManager = new ScienceManager();

// Експортуємо для використання в модулях
// Але перевіряємо, чи вже є екземпляр
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.scienceManager;
} else if (typeof window !== 'undefined') {
    // В браузері ми вже встановили window.scienceManager
}