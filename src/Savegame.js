class Savegame {
    constructor() {
        this.version = 'v0.17';
        this.credits = 0;
        this.highestWave = 0;
        this.highestWaveEver = 0;
        this.activeAntimatter = 0;
        this.pendingAntimatter = 0;
        this.upgrades = {
            'movementSpeed': 0,
            'maxShield': 0,
            'shieldRechargeTime': 0,
            'shieldRechargeAccelerator': 0,
            'overshieldChance': 0,
            'plasmaField': 0,
            'maxArmor': 0,
            'armorPlating': 0,
            'titaniumAlloy': 0,
            'repulsorField': 0,
            'rateOfFire': 0,
            'projectileDamage': 0,
            'clusterAmmunition': 0,
            'projectileAmount': 0,
            'projectileSpread': 0,
            'criticalHitChance': 0,
            'criticalHitDamage': 0,
            'projectilePierceChance': 0,
            'projectileForkChance': 0,
            'freezeChance': 0,
            'burnChance': 0,
            'salvager': 0
        };
        this.modules = {
            'solarPanels': 0,
            'scienceLab': 0,
            'factory': 0,
            'crewQuarters': 0,
            'waterTreatmentPlant': 0,
            'teleporter': 0,
            'droneBay': 0,
            'hangar': 0,
            'antimatterSiphon': 0,
            'warpDrive': 0
        }
    }
}