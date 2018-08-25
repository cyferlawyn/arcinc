class Station {
    constructor() {
        this.modules = {
            'solarPanels': {
                'title': 'Solar Panels',
                'cost': 100,
                'effect': 1
            },
            'scienceLab': {
                'title': 'Science Lab',
                'cost': 1100,
                'effect': 8
            },
            'factory': {
                'title': 'Factory',
                'cost': 12000,
                'effect': 47
            },
            'crewQuarters': {
                'title': 'Crew Quarters',
                'cost': 130000,
                'effect': 253
            },
            'waterTreatmentPlant': {
                'title': 'Water Treatment Plant',
                'cost': 1400000,
                'effect': 1327
            },
            'teleporter': {
                'title': 'Teleporter',
                'cost': 15000000,
                'effect': 6428
            }
        };
    }

    init() {
        this.calculateBuildingProduction = function() {
            for (let i = 0; i < Object.keys(arcInc.station.modules).length; i++) {
                let key = Object.keys(arcInc.station.modules)[i];
                let value = arcInc.station.modules[key];

                arcInc.savegame.credits += value.effect * arcInc.savegame.modules[key];
                arcInc.updateCredits();
                arcInc.saveSavegame();
            }
        };

        window.setInterval(this.calculateBuildingProduction, 1000);
    }
}