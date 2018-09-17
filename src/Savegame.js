class Savegame {
    constructor() {
        this.version = "v0.24";
        this.highestWave = 0;
        this.highestWaveEver = 0;
        this.credits = 0;
        this.activeAntimatter = 0;
        this.pendingAntimatter = 0;
        this.upgrades = {
            "movementSpeed": 0,
            "maxShield": 0,
            "shieldRechargeTime": 0,
            "shieldRechargeAccelerator": 0,
            "overshieldChance": 0,
            "plasmaField": 0,
            "maxArmor": 0,
            "armorPlating": 0,
            "titaniumAlloy": 0,
            "lifeSupportSystems": 0,
            "repulsorField": 0,
            "rateOfFire": 0,
            "projectileDamage": 0,
            "clusterAmmunition": 0,
            "tacticalWarhead": 0,
            "projectileAmount": 0,
            "projectileSpread": 0,
            "criticalHitChance": 0,
            "criticalHitDamage": 0,
            "projectilePierceChance": 0,
            "projectileForkChance": 0,
            "freezeChance": 0,
            "burnChance": 0,
            "salvager": 0
        };
        this.modules = {
            "factory": 0,
            "solarPanels": 0,
            "scienceLab": 0,
            "crewQuarters": 0,
            "waterTreatmentPlant": 0,
            "teleporter": 0,
            "droneBay": 0,
            "hangar": 0,
            "antimatterSiphon": 0,
            "warpDrive": 0
        };
        this.talents = {
            "waveCompressionThreshold": 0,
            "waveCompressionStrength": 0,
            "refinerBufferVolume": 0,
            "refinerCycleTime": 0,
            "refinerCycleVolume": 0,
            "refinerPurity": 0,
            "refinerOfflineVolume": 0,
            "acquisitionInterval": 0,
            "acquisitionBulkBuy": 0
        };
        this.refiner = {
            "bufferVolume": 0,
            "offensiveRefinedAntimatter": 0,
            "defensiveRefinedAntimatter": 0,
            "distribution": {
                "defensive": 50,
                "offensive": 50
            },
            "lastRun": Date.now()
        };
        this.acquisitions = {
            "active": false,
            "config": [
                {"category": "modules", "name": "factory", "skip": false},
                {"category": "modules", "name": "solarPanels", "skip": false},
                {"category": "modules", "name": "scienceLab", "skip": false},
                {"category": "modules", "name": "crewQuarters", "skip": false},
                {"category": "modules", "name": "waterTreatmentPlant", "skip": false},
                {"category": "modules", "name": "teleporter", "skip": false},
                {"category": "modules", "name": "droneBay", "skip": false},
                {"category": "modules", "name": "hangar", "skip": false},
                {"category": "modules", "name": "antimatterSiphon", "skip": false},
                {"category": "modules", "name": "warpDrive", "skip": false},

                {"category": "upgrades", "name": "movementSpeed", "skip": false},
                {"category": "upgrades", "name": "maxShield", "skip": false},
                {"category": "upgrades", "name": "shieldRechargeTime", "skip": false},
                {"category": "upgrades", "name": "shieldRechargeAccelerator", "skip": false},
                {"category": "upgrades", "name": "overshieldChance", "skip": false},
                {"category": "upgrades", "name": "plasmaField", "skip": false},
                {"category": "upgrades", "name": "maxArmor", "skip": false},
                {"category": "upgrades", "name": "armorPlating", "skip": false},
                {"category": "upgrades", "name": "titaniumAlloy", "skip": false},
                {"category": "upgrades", "name": "lifeSupportSystems", "skip": false},
                {"category": "upgrades", "name": "repulsorField", "skip": false},
                {"category": "upgrades", "name": "rateOfFire", "skip": false},
                {"category": "upgrades", "name": "projectileDamage", "skip": false},
                {"category": "upgrades", "name": "clusterAmmunition", "skip": false},
                {"category": "upgrades", "name": "tacticalWarhead", "skip": false},
                {"category": "upgrades", "name": "projectileAmount", "skip": false},
                {"category": "upgrades", "name": "projectileSpread", "skip": true},
                {"category": "upgrades", "name": "criticalHitChance", "skip": false},
                {"category": "upgrades", "name": "criticalHitDamage", "skip": false},
                {"category": "upgrades", "name": "projectilePierceChance", "skip": false},
                {"category": "upgrades", "name": "projectileForkChance", "skip": false},
                {"category": "upgrades", "name": "freezeChance", "skip": true},
                {"category": "upgrades", "name": "burnChance", "skip": false},
                {"category": "upgrades", "name": "salvager", "skip": false}
            ]
        }
    }
}