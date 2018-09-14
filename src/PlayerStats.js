class PlayerStats {
    calculate() {
        // Module based scaling
        this.solarPanelScaling =  0.1 *  (this.ml('solarPanels'));
        this.factoryScaling = 1 + 0.5 * (this.ml('factory'));

        // Upgrade based scaling
        this.movementSpeed = 1 + 0.01 * this.ul('movementSpeed');

        this.maxShield = 1 + 0.5 * this.ul('maxShield');
        this.plasmaField = 1 + this.ul('plasmaField');

        this.maxArmor = 1 + 0.5 * this.ul('maxArmor');
        this.titaniumAlloy = 1 + this.ul('titaniumAlloy');

        this.lifeSupportSystems = 1 + this.ul('lifeSupportSystems');

        this.repulsorField = Math.max(0.0001, 0.99 ** this.ul('repulsorField')  / Math.max(1, this.ul('repulsorField') * 0.1 + 1) );

        this.armorPlating = -100 * (0.5 * this.ul('armorPlating') * this.titaniumAlloy);

        this.shieldRechargeTime = 1 + 0.025 * this.ul('shieldRechargeTime');
        this.shieldRechargeAccelerator = 1 + 0.02 * this.ul('shieldRechargeAccelerator');

        this.projectileDamage = 1 + 0.75 * this.ul('projectileDamage');
        this.clusterAmmunition = 1 + 0.5 * this.ul('clusterAmmunition');
        this.tacticalWarhead = 1 + 5 * this.ul('tacticalWarhead');

        this.projectileAmount = (1 + this.ul('projectileAmount'));
        this.projectileSpread = (1 + 0.005 * this.ul('projectileSpread'));

        this.criticalHitDamage = 1 + 0.5 * this.ul('criticalHitDamage');

        this.rateOfFire = 2 + 3 * (1 - Math.pow(0.995, this.ul('rateOfFire')));

        this.overshieldChance = 0.25 * this.ul('overshieldChance');
        this.projectilePierceChance = 0.25 * this.ul('projectilePierceChance');
        this.projectileForkChance = 0.25 * this.ul('projectileForkChance');
        this.criticalHitChance = 0.25 * this.ul('criticalHitChance');
        this.freezeChance = 0.25 * this.ul('freezeChance');
        this.burnChance = 0.25 * this.ul('burnChance');

        this.salvager = 1 + 0.025 * this.ul('salvager');

        this.antimatterScaling = (1 + 0.01 * arcInc.savegame.activeAntimatter);

        // effective stats
        this.effectiveMovementSpeed = 10 + this.movementSpeed;

        this.effectiveMaxEnergy = 100 + 1 * this.solarPanelScaling;
        this.effectiveEnergyRegenerationPerTick = 5 / 60;

        this.effectiveMaxShield = 100 * this.maxShield * this.plasmaField * this.lifeSupportSystems * this.factoryScaling * this.antimatterScaling;
        this.effectiveMaxArmor = 750 * this.maxArmor * this.titaniumAlloy * this.lifeSupportSystems * this.factoryScaling * this.antimatterScaling;

        this.effectiveShieldRechargePerTickInCombat = this.effectiveMaxShield / (600 / (this.shieldRechargeTime) * 60);
        this.effectiveShieldRechargePerTickOutOfCombat = this.effectiveShieldRechargePerTickInCombat * this.shieldRechargeAccelerator;

        this.effectiveRelativeIncomingDamageMultiplier = this.repulsorField;
        this.effectiveAbsoluteIncomingShieldDamageAddition = 0;
        this.effectiveAbsoluteIncomingArmorDamageAddition = this.armorPlating;

        this.effectiveProjectileAmount = Math.min(50, this.projectileAmount);
        this.effectiveProjectileAmountCompensation = 1 + (this.projectileAmount - this.effectiveProjectileAmount) / this.effectiveProjectileAmount;

        this.effectiveProjectileSpread = this.projectileSpread;

        this.effectiveProjectileDamage = 10 * this.projectileDamage * this.clusterAmmunition * this.tacticalWarhead * this.effectiveProjectileAmountCompensation * this.factoryScaling * this.antimatterScaling;
        this.effectiveCriticalHitDamageMultiplier = this.criticalHitDamage;
        this.effectiveFireDelayInTicks = 60 / this.rateOfFire;

        this.effectiveKillCreditMultiplier = this.salvager;
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