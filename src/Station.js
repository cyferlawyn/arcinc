class Station {
    constructor() {
        this.modules = {
            'solarPanels': {
                'title': 'Solar Panels', // ROI = 1:40
                'cost': 100,
                'effect': 1,
                'description': 'Generates a static amount of credits each second'
            },
            'scienceLab': {
                'title': 'Science Lab', // ROI = 2:18
                'cost': 1100,
                'effect': 8,
                'description': 'Generates a static amount of credits each second'
            },
            'factory': {
                'title': 'Factory', // ROI = 4:15
                'cost': 12000,
                'effect': 47,
                'description': 'Generates a static amount of credits each second'
            },
            'crewQuarters': {
                'title': 'Crew Quarters', // ROI = 8:34
                'cost': 130000,
                'effect': 253,
                'description': 'Generates a static amount of credits each second'
            },
            'waterTreatmentPlant': {
                'title': 'Water Treatment Plant', // ROI = 17:35
                'cost': 1400000,
                'effect': 1327,
                'description': 'Generates a static amount of credits each second'
            },
            'teleporter': {
                'title': 'Teleporter', // ROI = 24:00
                'cost': 15000000,
                'effect': 10416,
                'description': 'Generates a static amount of credits each second'
            },
            'droneBay': {
                'title': 'Drone Bay', // ROI = 33:00
                'cost': 160000000,
                'effect': 80808,
                'description': 'Generates a static amount of credits each second'
            },
            'hangar': {
                'title': 'Hangar',  // ROI = 45:00
                'cost': 1700000000,
                'effect': 630630,
                'description': 'Generates a static amount of credits each second'
            },
            'antimatterSiphon': {
                'title': 'Antimatter Siphon', // ROI = 60:00
                'cost': 18000000000,
                'effect': 4987284,
                'description': 'Generates a static amount of credits each second'
            },
            'warpDrive': {
                'title': 'Warp Drive', // ROI = 75:00
                'cost': 190000000000,
                'effect': 42424242,
                'description': 'Generates a static amount of credits each second'
            }
        };

        this.cps = 0;
    }

    init() {
        this.calculateBuildingProduction = function() {

            let cps = 0;
            for (let i = 0; i < Object.keys(arcInc.station.modules).length; i++) {
                let key = Object.keys(arcInc.station.modules)[i];
                let value = arcInc.station.modules[key];

                cps += value.effect * arcInc.savegame.modules[key];
            }

            arcInc.station.cps = cps;
            arcInc.savegame.credits += cps;
            arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
            arcInc.saveSavegame();
        };

        window.setInterval(this.calculateBuildingProduction, 1000);
    }
}