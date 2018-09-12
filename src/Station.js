class Station {
    constructor() {
        this.modules = {
            'factory': {
                'title': 'Factory',
                'cost': 100,
                'effect': 1,
                'description': 'Generates a static amount of credits each second. Slightly increases your ship\'s max shield, max armor, and damage.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'scienceLab', 'level': 1}]
            },
            'solarPanels': {
                'title': 'Solar Panels',
                'cost': 1100,
                'effect': 8,
                'description': 'Generates a static amount of credits each second. Slightly increases your ship\'s max energy.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': []
            },
            'scienceLab': {
                'title': 'Science Lab',
                'cost': 12000,
                'effect': 47,
                'description': 'Generates a static amount of credits each second.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'solarPanels', 'level': 1}]
            },
            'crewQuarters': {
                'title': 'Crew Quarters',
                'cost': 130000,
                'effect': 253,
                'description': 'Generates a static amount of credits each second.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'factory', 'level': 1}]
            },
            'waterTreatmentPlant': {
                'title': 'Water Treatment Plant',
                'cost': 1400000,
                'effect': 1327,
                'description': 'Generates a static amount of credits each second.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'crewQuarters', 'level': 1}]
            },
            'teleporter': {
                'title': 'Teleporter',
                'cost': 15000000,
                'effect': 10416,
                'description': 'Generates a static amount of credits each second.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'waterTreatmentPlant', 'level': 1}]
            },
            'droneBay': {
                'title': 'Drone Bay',
                'cost': 160000000,
                'effect': 80808,
                'description': 'Generates a static amount of credits each second.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'teleporter', 'level': 1}]
            },
            'hangar': {
                'title': 'Hangar',
                'cost': 1700000000,
                'effect': 630630,
                'description': 'Generates a static amount of credits each second.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'droneBay', 'level': 1}]
            },
            'antimatterSiphon': {
                'title': 'Antimatter Siphon',
                'cost': 18000000000,
                'effect': 4987284,
                'description': 'Generates a static amount of credits each second. Also acts as a collection multiplier for Antimatter.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'hangar', 'level': 1}]
            },
            'warpDrive': {
                'title': 'Warp Drive',
                'cost': 190000000000,
                'effect': 42424242,
                'description': 'Generates a static amount of credits each second. Also unlocks the Warp-Button to prestige.',
                'effectTemplate': '+{EFFECT} $/s',
                'requirements': [{'type': 'modules', 'name': 'antimatterSiphon', 'level': 1}]
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

                cps += value.effect * (1 + 0.01 * arcInc.savegame.activeAntimatter) * arcInc.savegame.modules[key];
            }

            arcInc.station.cps = cps;
            arcInc.savegame.credits += cps;
            arcInc.eventEmitter.emit(Events.CREDITS_UPDATED, arcInc.savegame.credits);
            arcInc.saveSavegame();
        };

        window.setInterval(this.calculateBuildingProduction, 1000);
    }
}