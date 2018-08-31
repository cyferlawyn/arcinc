class PlayerStats {
    calculate() {
        // Module based scaling
        this.factoryScaling = 1 + Math.max(0, 0.25 * (this.ml('factory') - 50));

        // Upgrade based scaling
        this.movementSpeed = 1 + 0.05 * this.ul('movementSpeed');

        this.maxShield = 1 + 0.1 * this.ul('maxShield');
        this.plasmaField = 1 + this.ul('plasmaField');

        this.maxArmor = 1 + 0.1 * this.ul('maxArmor');
        this.titaniumAlloy = 1 + this.ul('titaniumAlloy');

        this.maxStructure = 1 + 0.1 * this.ul('maxStructure');

        this.repulsorField = 0.999 * (1 - 0.99 ** this.ul('repulsorField'));

        this.armorPlating = -100 * (0.5 * this.ul('armorPlating') * this.titaniumAlloy);

        this.shieldRechargeTime = 1 + 0.05 * this.ul('shieldRechargeTime');
        this.shieldRechargeAccelerator = 1 + 0.1 * this.ul('shieldRechargeAccelerator');

        this.projectileDamage = 1 + 0.05 * this.ul('projectileDamage');
        this.clusterAmmunition = 1 + 0.1 * this.ul('clusterAmmunition');

        this.projectileAmount = (1 + this.ul('projectileAmount'));
        this.projectileSpread = (1 + 0.005 * this.ul('projectileSpread'));

        this.criticalHitDamage = 1 + 0.1 * this.ul('criticalHitDamage');

        this.rateOfFire = 1 + 3 * (1 - Math.pow(0.995, this.ul('rateOfFire')));

        this.overshieldChance = 0.25 * this.ul('overshieldChance');
        this.projectilePierceChance = 0.25 * this.ul('projectilePierceChance');
        this.projectileForkChance = 0.25 * this.ul('projectileForkChance');
        this.criticalHitChance = 0.25 * this.ul('criticalHitChance');
        this.freezeChance = 0.25 * this.ul('freezeChance');
        this.burnChance = 0.25 * this.ul('burnChance');

        // effective stats
        this.effectiveMovementSpeed = 5 * this.movementSpeed;

        this.effectiveMaxShield = 100 * this.maxShield * this.plasmaField * this.factoryScaling;
        this.effectiveMaxArmor = 250 * this.maxArmor * this.titaniumAlloy * this.factoryScaling;
        this.effectiveMaxStructure = 500 * this.maxStructure  * this.factoryScaling**2;

        this.effectiveShieldRechargePerTickInCombat = this.effectiveMaxShield / (600 / (this.shieldRechargeTime) * 60);
        this.effectiveShieldRechargePerTickOutOfCombat = this.effectiveShieldRechargePerTickInCombat * this.shieldRechargeAccelerator;

        this.effectiveRelativeIncomingDamageMultiplier = 1 - this.repulsorField;
        this.effectiveAbsoluteIncomingShieldDamageAddition = 0;
        this.effectiveAbsoluteIncomingArmorDamageAddition = this.armorPlating;
        this.effectiveAbsoluteIncomingStructureDamageAddition = 0;

        this.effectiveProjectileAmount = Math.min(5, this.projectileAmount);
        this.effectiveProjectileAmountCompensation = 1 + (this.projectileAmount - this.effectiveProjectileAmount) / this.effectiveProjectileAmount;

        this.effectiveProjectileSpread = this.projectileSpread;

        this.effectiveProjectileDamage = 10 * this.projectileDamage * this.clusterAmmunition * this.effectiveProjectileAmountCompensation;
        this.effectiveCriticalHitDamageMultiplier = this.criticalHitDamage * this.factoryScaling ** 0.75;
        this.effectiveFireDelayInTicks = 60 / this.rateOfFire;
    }

    ul(name) {
        return arcInc.savegame.upgrades[name];
    }

    ml(name) {
        return arcInc.savegame.modules[name];
    }

    chanceHappened(name) {
        if (this[name] === 100) {
            return true;
        } else {
            return Math.random() * 100 <= this[name];
        }
    }
}