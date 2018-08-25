class Savegame {
    constructor() {
        this.version = 'v0.6';
        this.credits = 0;
        this.highestWave = 0;
        this.upgrades = {
            'movementSpeed': 0,
            'maxShield': 0,
            'shieldRechargeTime': 0,
            'maxArmor': 0,
            'maxStructure': 0,
            'projectileDamage': 0,
            'projectileAmount': 0,
            'projectileSpread': 0,
            'rateOfFire': 0,
            'shieldRechargeAccelerator': 0,
            'repulsorField': 0,
            'criticalHitChance': 0,
            'criticalHitDamage': 0,
            'projectilePierceChance': 0,
            'armorPlating': 0,
            'deescalation': 0
        };
        this.modules = {
            'solarPanels': 0,
            'scienceLab': 0,
            'factory': 0,
            'crewQuarters': 0,
            'waterTreatmentPlant': 0,
            'teleporter': 0
        }
    }
}