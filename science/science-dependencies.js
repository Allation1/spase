// Файл для визначення залежностей між науками

// Визначаємо залежності для кожної науки
export const scienceDependencies = {
    geology: {
        // Для вивчення геології потрібно мати рівень, що дорівнює половині потрібного рівня для фізики, хімії та біології
        checkRequirements: (targetLevel, scienceLevels) => {
            const requiredLevel = Math.floor(targetLevel / 2);
            return {
                fulfilled: scienceLevels.physics >= requiredLevel &&
                          scienceLevels.chemistry >= requiredLevel &&
                          scienceLevels.biology >= requiredLevel,
                requirements: [
                    { science: 'Фізика', current: scienceLevels.physics, required: requiredLevel },
                    { science: 'Хімія', current: scienceLevels.chemistry, required: requiredLevel },
                    { science: 'Біологія', current: scienceLevels.biology, required: requiredLevel }
                ]
            };
        }
    },
    hydrogeology: {
        // Для вивчення наступного рівня гідрогеології можна вивчити дві гідрогеології за кожну геологію
        checkRequirements: (targetLevel, scienceLevels) => {
            const maxAllowedByGeology = scienceLevels.geology * 2;
            return {
                fulfilled: targetLevel <= maxAllowedByGeology,
                requirements: [
                    { science: 'Геологія', current: scienceLevels.geology, required: Math.ceil(targetLevel / 2) }
                ]
            };
        }
    },
    construction: {
        // Для вивчення будівництва потрібен один рівень геометрії, геології та матеріалознавства на кожні два рівні будівництва
        checkRequirements: (targetLevel, scienceLevels) => {
            const requiredLevel = Math.ceil(targetLevel / 2);
            return {
                fulfilled: scienceLevels.geometry >= requiredLevel &&
                          scienceLevels.geology >= requiredLevel &&
                          scienceLevels.materials >= requiredLevel,
                requirements: [
                    { science: 'Геометрія', current: scienceLevels.geometry, required: requiredLevel },
                    { science: 'Геологія', current: scienceLevels.geology, required: requiredLevel },
                    { science: 'Матеріалознавство', current: scienceLevels.materials, required: requiredLevel }
                ]
            };
        }
    },
    geometry: {
        // Для вивчення геометрії потрібен один рівень фізики та хімії на кожні два рівні геометрії
        checkRequirements: (targetLevel, scienceLevels) => {
            const requiredLevel = Math.floor((targetLevel + 1) / 2);
            return {
                fulfilled: scienceLevels.physics >= requiredLevel &&
                          scienceLevels.chemistry >= requiredLevel,
                requirements: [
                    { science: 'Фізика', current: scienceLevels.physics, required: requiredLevel },
                    { science: 'Хімія', current: scienceLevels.chemistry, required: requiredLevel }
                ]
            };
        }
    },
    materials: {
        // Для вивчення матеріалознавства потрібен один рівень фізики та хімії на кожні два рівні матеріалознавства
        checkRequirements: (targetLevel, scienceLevels) => {
            const requiredLevel = Math.floor((targetLevel + 1) / 2);
            return {
                fulfilled: scienceLevels.physics >= requiredLevel &&
                          scienceLevels.chemistry >= requiredLevel,
                requirements: [
                    { science: 'Фізика', current: scienceLevels.physics, required: requiredLevel },
                    { science: 'Хімія', current: scienceLevels.chemistry, required: requiredLevel }
                ]
            };
        }
    }
};

// Функція для перевірки залежностей
export function checkScienceRequirements(scienceId, targetLevel, scienceLevels) {
    if (scienceDependencies[scienceId]) {
        return scienceDependencies[scienceId].checkRequirements(targetLevel, scienceLevels);
    }

    // Перевіряємо особливі випадки для будівель
    if (scienceId === 'building_center') {
        // Для вивчення наукового центру: потрібен 1 рівень будівництва на кожні 2 рівні наукового центру
        const requiredConstructionLevel = Math.ceil(targetLevel / 2);
        return {
            fulfilled: scienceLevels.construction >= requiredConstructionLevel,
            requirements: [
                { science: 'Будівництво', current: scienceLevels.construction, required: requiredConstructionLevel }
            ]
        };
    }

    if (scienceId === 'building_source') {
        // Для вивчення джерела: потрібно 2 рівні гідрогеології за кожен рівень джерела
        const requiredHydrogeologyLevel = targetLevel * 2;
        return {
            fulfilled: scienceLevels.hydrogeology >= requiredHydrogeologyLevel,
            requirements: [
                { science: 'Гідрогеологія', current: scienceLevels.hydrogeology, required: requiredHydrogeologyLevel }
            ]
        };
    }

    // Якщо для науки немає спеціальних залежностей, вважаємо, що вимоги виконані
    return {
        fulfilled: true,
        requirements: []
    };
}