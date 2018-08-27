class Station {
    constructor() {
        this.modules = {
            'solarPanels': {
                'title': 'Solar Panels', // ROI = 1:40
                'cost': 100,
                'effect': 1
            },
            'scienceLab': {
                'title': 'Science Lab', // ROI = 2:18
                'cost': 1100,
                'effect': 8
            },
            'factory': {
                'title': 'Factory', // ROI = 4:15
                'cost': 12000,
                'effect': 47
            },
            'crewQuarters': {
                'title': 'Crew Quarters', // ROI = 8:34
                'cost': 130000,
                'effect': 253
            },
            'waterTreatmentPlant': {
                'title': 'Water Treatment Plant', // ROI = 17:35
                'cost': 1400000,
                'effect': 1327
            },
            'teleporter': {
                'title': 'Teleporter', // ROI = 24:00
                'cost': 15000000,
                'effect': 10416
            },
            'droneBay': {
                'title': 'Drone Bay', // ROI = 33:00
                'cost': 160000000,
                'effect': 80808
            },
            'hangar': {
                'title': 'Hangar',  // ROI = 45:00
                'cost': 1700000000,
                'effect': 630630
            },
            'antimatterSiphon': {
                'title': 'Antimatter Siphon', // ROI = 60:00
                'cost': 18000000000,
                'effect': 4987284
            },
            'warpDrive': {
                'title': 'Warp Drive', // ROI = 75:00
                'cost': 190000000000,
                'effect': 42424242
            }
        };
    }

    init() {
        this.calculateBuildingProduction = function() {

            let cps = 0;
            for (let i = 0; i < Object.keys(arcInc.station.modules).length; i++) {
                let key = Object.keys(arcInc.station.modules)[i];
                let value = arcInc.station.modules[key];

                cps += value.effect * arcInc.savegame.modules[key];
            }

            arcInc.savegame.credits += cps;
            arcInc.cps = cps;
            arcInc.updateCredits();
            arcInc.saveSavegame();
        };

        window.setInterval(this.calculateBuildingProduction, 1000);
    }
}