// Дані про планету Тера
export const terraData = {
    id: 'terra',
    name: 'Тера',
    type: 'Головна планета',
    description: 'Головна планета гравітаційної системи',
    resources: {
        'Населення': 100,
        'Вода': 100,
        'Деревина': 100,
        'Каміння': 100
    },
    buildings: [
        { id: 'building_center', name: 'Науковий центр', level: 1 },
        { id: 'building_source', name: 'Джерело', level: 1 },
        { id: 'building_house', name: 'Будинок', level: 1 },
        { id: 'building_warehouse', name: 'Склад', level: 1 }
    ],
    research: [
        { id: 'physics', name: 'Фізика', completed: false },
        { id: 'chemistry', name: 'Хімія', completed: false }
    ]
};