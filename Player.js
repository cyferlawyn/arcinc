class Player extends PIXI.Sprite {
    constructor(texture, arcInc, spawner, boundaryWidth, boundaryHeight) {
        super(texture);

        this.arcInc = arcInc;
        this.spawner = spawner;
        this.boundaryWidth = boundaryWidth;
        this.boundaryHeight = boundaryHeight;
        this.destination = null;
        this.ticksSinceLastHit = 0;

        this.credits = 0;

        this.upgrades = {
            'movementSpeed': {
                'title': 'Movement Speed',
                'baseValue': 5,
                'effect': 0.05,
                'cost': 10,
                'description': 'Increases the Movement Speed<br/><br/>' +
                    'Value: 1 + 0.05 * level<br/><br/>' +
                    'Movement Speed: 5 * [Movement Speed]'
            },
            'maxShield': {
                'title': 'Shield Amount',
                'baseValue': 100,
                'effect': 0.1,
                'cost': 25,
                'description': 'Increases the Maximum Shield<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Maximum Shield: 100 * [Shield Amount] * [Plasma Field]'
            },
            'plasmaField': {
                'title': 'Plasma Field',
                'baseValue': 1,
                'effect': 1,
                'cost': 500000,
                'description': 'Increases the Maximum Shield<br/><br/>' +
                    'Value: 1 + level<br/><br/>' +
                    'Maximum Shield: 100 * [Shield Amount] * [Plasma Field]'
            },
            'shieldRechargeTime': {
                'title': 'Shield Recharge',
                'baseValue': 600,
                'effect': 0.05,
                'cost': 25,
                'description': 'Decreases the Shield Recharge Time (<i>Aka increases the shield regeneration per frame</i>)<br/><br/>' +
                    'Value: 1 + 0.05 * level<br/><br/>' +
                    'Shield Recharge Time: 600 / [Shield Recharge] * [Shield Recharge Accelerator]'
            },
            'shieldRechargeAccelerator': {
                'title': 'Shield Recharge Accelerator',
                'baseValue': 1,
                'effect': 0.1,
                'cost': 5000,
                'description': 'When not being hit for 300 frames, decreases the Shield Recharge Time substantially (<i>Aka increases the shield regeneration per frame</i>)<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Shield Recharge Time: 600 / [Shield Recharge] * [Shield Recharge Accelerator]'
            },
            'overshieldChance': {
                'title': 'Overshield Chance',
                'baseValue': 1,
                'effect': 0.25,
                'cost': 100000,
                'description': 'Chance that a hit is fully absorbed by the shield without affecting armor or structure. Requires full shield to trigger and will deplete the whole shield bar<br/><br/>' +
                    'Value: 0.25 * level<br/><br/>'
            },
            'maxArmor': {
                'title': 'Armor Amount',
                'baseValue': 250,
                'effect': 0.1,
                'cost': 25,
                'description': 'Increases the Maximum Armor<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Maximum Armor: 100 * [Armor Amount] * [Titanium Alloy]'
            },
            'armorPlating': {
                'title': 'Armor Plating',
                'baseValue': 100,
                'effect': 0.5,
                'cost': 25000,
                'description': 'Reduces armor and structure damage taken by an absolute value<br/><br/>' +
                    'Value: 50 * level<br/><br/>' +
                    'Damage taken: (Damage / [Repulsor Field]) - [Current Shield] - ([Armor Plating] * [Titanium Alloy]) - [Current Armor] - [Current Structure])'
            },
            'titaniumAlloy': {
                'title': 'Titanium Alloy',
                'baseValue': 1,
                'effect': 1,
                'cost': 500000,
                'description': 'Increases the Maximum Armor<br/><br/>' +
                    'Value: 1 + level<br/><br/>' +
                    'Maximum Armor: 100 * [Armor Amount] * [Titanium Alloy]'
            },
            'maxStructure': {
                'title': 'Structure Amount',
                'baseValue': 500,
                'effect': 0.1,
                'cost': 25,
                'description': 'Increases the Maximum Structure<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Maximum Structure: 500 * [Structure Amount]'
            },
            'repulsorField': {
                'title': 'Repulsor Field',
                'baseValue': 1,
                'effect': 0.1,
                'cost': 5000,
                'description': 'Reduces all incoming damage by a relative amount<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Damage taken: (Damage / [Repulsor Field]) - [Current Shield] - ([Armor Plating] * [Titanium Alloy]) - [Current Armor] - [Current Structure])'
            },
            'rateOfFire': {
                'title': 'Rate of Fire',
                'baseValue': 1,
                'effect': 0.025,
                'cost': 50,
                'description': 'Increases the projectile fire rate<br/><br/>' +
                    'Value: 1 + 0.025 * level<br/><br/>' +
                    'Frames per projectile: 60 / [Rate of Fire]'
            },
            'projectileDamage': {
                'title': 'Projectile Damage',
                'baseValue': 10,
                'effect': 0.05,
                'cost': 50,
                'description': 'Increases the projectile damage<br/><br/>' +
                    'Value: 1 + 0.05 * level<br/><br/>' +
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 10) / 10)'
            },
            'clusterAmmunition': {
                'title': 'Cluster Ammunition',
                'baseValue': 1,
                'effect': 0.1,
                'cost': 500000,
                'description': 'Increases the projectile damage<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 10) / 10)'
            },
            'projectileAmount': {
                'title': 'Projectile Amount',
                'baseValue': 1,
                'effect': 1,
                'cost': 5000,
                'description': 'Increases the amount of projectiles to up to 10. Subsequent levels instead increase the projectile damage further<br/><br/>' +
                'Value: 1 + 0.05 * level<br/><br/>' +
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 10) / 10)'
            },
            'projectileSpread': {
                'title': 'Projectile Spread',
                'baseValue': 1,
                'effect': 0.005,
                'cost': 5000,
                'description': 'Increases the spread in case more than 1 projectile is fired at once<br/><br/>' +
                    'Value: 1 + 0.005 * level<br/><br/>' +
                    'Maximum Horizontal Velocity: [Projectile Spread] / ([Projectile Amount] - 1) * 9 - [Projectile Spread] / 2;'
            },
            'criticalHitChance': {
                'title': 'Critical Hit Chance',
                'baseValue': 1,
                'effect': 0.25,
                'cost': 10000,
                'description': 'Chance to perform a critical hit<br/><br/>' +
                    'Value: 0.25 * level<br/><br/>'
            },
            'criticalHitDamage': {
                'title': 'Critical Hit Damage',
                'baseValue': 1,
                'effect': 0.1,
                'cost': 10000,
                'description': 'Increases the damage dealt when performing a critical hit<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 10) / 10)'
            },
            'projectilePierceChance': {
                'title': 'Projectile Pierce Chance',
                'baseValue': 1,
                'effect': 0.25,
                'cost': 25000,
                'description': 'Chance that the projectile is not consumed upon impact. Can not hit the same enemy multiple times<br/><br/>' +
                    'Value: 0.25 * level<br/><br/>'
            },
            'projectileForkChance': {
                'title': 'Projectile Fork Chance',
                'baseValue': 1,
                'effect': 0.25,
                'cost': 25000,
                'description': 'Chance that the projectile is split into 3 upon impact. Can not hit the same enemy multiple times<br/><br/>' +
                    'Value: 0.25 * level<br/><br/>'
            },
            'freezeChance': {
                'title': 'Freeze Chance',
                'baseValue': 1,
                'effect': 0.25,
                'cost': 100000,
                'description': 'Chance that the enemy is frozen, which reduces his movement speed by 2% per hit. Stacks multiplicative<br/><br/>' +
                    'Value: 0.25 * level<br/><br/>'
            },
            'burnChance': {
                'title': 'Burn Chance',
                'baseValue': 1,
                'effect': 0.25,
                'cost': 500000,
                'description': 'Chance that the enemy catches fire upon impact, dealing 1% of [Projectile Damage] each tick. Stacks additive<br/><br/>' +
                    'Value: 0.25 * level<br/><br/>'
            }
        };

        this.applyUpgrades();
        this.currentShield = this.maxShield;
        this.currentArmor = this.maxArmor;
        this.currentStructure = this.maxStructure;
    }

    applyUpgrades() {
        this.movementSpeed = this.upgrades['movementSpeed'].baseValue * (1 + this.upgrades['movementSpeed'].effect * this.arcInc.savegame.upgrades['movementSpeed']);

        this.plasmaField = this.upgrades['plasmaField'].baseValue * (1 + this.upgrades['plasmaField'].effect * this.arcInc.savegame.upgrades['plasmaField']);
        this.maxShield = this.upgrades['maxShield'].baseValue * (1 + this.upgrades['maxShield'].effect * this.arcInc.savegame.upgrades['maxShield'] * this.plasmaField);

        this.shieldRechargeTime = this.upgrades['shieldRechargeTime'].baseValue / (1 + this.upgrades['shieldRechargeTime'].effect * this.arcInc.savegame.upgrades['shieldRechargeTime']);
        this.shieldRechargeAccelerator = this.upgrades['shieldRechargeAccelerator'].baseValue * (1 + this.upgrades['shieldRechargeAccelerator'].effect * this.arcInc.savegame.upgrades['shieldRechargeAccelerator']);
        this.overshieldChance = this.upgrades['overshieldChance'].baseValue * (1 + this.upgrades['overshieldChance'].effect * this.arcInc.savegame.upgrades['overshieldChance']) - 1;

        this.titaniumAlloy = this.upgrades['titaniumAlloy'].baseValue * (1 + this.upgrades['titaniumAlloy'].effect * this.arcInc.savegame.upgrades['titaniumAlloy']);
        this.maxArmor = this.upgrades['maxArmor'].baseValue * (1 + this.upgrades['maxArmor'].effect * this.arcInc.savegame.upgrades['maxArmor'] * this.titaniumAlloy);
        this.armorPlating = this.upgrades['armorPlating'].baseValue * (this.upgrades['armorPlating'].effect * this.arcInc.savegame.upgrades['armorPlating'] * this.titaniumAlloy);

        this.maxStructure = this.upgrades['maxStructure'].baseValue * (1 + this.upgrades['maxStructure'].effect * this.arcInc.savegame.upgrades['maxStructure']);
        this.repulsorField = this.upgrades['repulsorField'].baseValue * (1 + this.upgrades['repulsorField'].effect * this.arcInc.savegame.upgrades['repulsorField']);
        if (this.repulsorField > 99) {
            this.repulsorField = 99;
        }

        this.clusterAmmunition = this.upgrades['clusterAmmunition'].baseValue * (1 + this.upgrades['clusterAmmunition'].effect * this.arcInc.savegame.upgrades['clusterAmmunition']);
        this.projectileDamage = this.upgrades['projectileDamage'].baseValue * (1 + this.upgrades['projectileDamage'].effect * this.arcInc.savegame.upgrades['projectileDamage'] * this.clusterAmmunition);

        this.projectileAmount = this.upgrades['projectileAmount'].baseValue * (1 + this.upgrades['projectileAmount'].effect * this.arcInc.savegame.upgrades['projectileAmount']);
        this.projectileSpread = this.upgrades['projectileSpread'].baseValue * (1 + this.upgrades['projectileSpread'].effect * this.arcInc.savegame.upgrades['projectileSpread']);

        this.projectilePierceChance = this.upgrades['projectilePierceChance'].baseValue * (1 + this.upgrades['projectilePierceChance'].effect * this.arcInc.savegame.upgrades['projectilePierceChance']);
        this.projectileForkChance = this.upgrades['projectileForkChance'].baseValue * (1 + this.upgrades['projectileForkChance'].effect * this.arcInc.savegame.upgrades['projectileForkChance']);

        this.criticalHitChance = this.upgrades['criticalHitChance'].baseValue * (1 + this.upgrades['criticalHitChance'].effect * this.arcInc.savegame.upgrades['criticalHitChance']) - 1;
        this.criticalHitDamage = this.upgrades['criticalHitDamage'].baseValue * (1 + this.upgrades['criticalHitDamage'].effect * this.arcInc.savegame.upgrades['criticalHitDamage']) - 1;

        this.freezeChance = this.upgrades['freezeChance'].baseValue * (1 + this.upgrades['freezeChance'].effect * this.arcInc.savegame.upgrades['freezeChance']) - 1;
        this.burnChance = this.upgrades['burnChance'].baseValue * (1 + this.upgrades['burnChance'].effect * this.arcInc.savegame.upgrades['burnChance']) - 1;

        this.rateOfFire = this.upgrades['rateOfFire'].baseValue * (1 + this.upgrades['rateOfFire'].effect * this.arcInc.savegame.upgrades['rateOfFire']);
        this.fireDelay = 60 / this.rateOfFire;
        this.currentDelay = 0;
    }

    update() {
        this.ticksSinceLastHit++;

        this.move();
        this.regenerate();
        this.engage();
    }

    move() {
        if (this.destination !== null) {
            let pX = this.x + this.width / 2;
            let pY = this.y + this.height / 2;

            // To prevent costly calculations in case the player is already very close to the cursor, start with a check
            if (Math.abs(pX - this.destination.x / arcInc.pixiApp.stage.scale.x) < this.movementSpeed && Math.abs(pY - this.destination.y / arcInc.pixiApp.stage.scale.y) < this.movementSpeed) {
                this.position.set(this.destination.x / arcInc.pixiApp.stage.scale.x - this.width / 2, this.destination.y / arcInc.pixiApp.stage.scale.y - this.height / 2);
                this.destination = null;
            } else {

                let distanceX = this.destination.x / arcInc.pixiApp.stage.scale.x - pX;
                let distanceY = this.destination.y / arcInc.pixiApp.stage.scale.y - pY;

                // calculate the velocity vector length
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // normalize velocity vector length
                this.vx = distanceX / distance;
                this.vy = distanceY / distance;

                // apply movement speed
                this.vx = this.vx * this.movementSpeed;
                this.vy = this.vy * this.movementSpeed;

                this.position.set(this.x + this.vx, this.y + this.vy);
            }

            // Enforce boundaries
            if (this.x + this.width > this.boundaryWidth) {
                this.x = this.boundaryWidth - this.width;
            }

            if (this.y + this.height > this.boundaryHeight) {
                this.y = this.boundaryHeight - this.height;
            }

            if (this.x < 0) {
                this.x = 0;
            }

            if (this.y < 0) {
                this.y = 0;
            }
        }
    }

    regenerate() {
        let shieldRecharge = this.maxShield / (this.shieldRechargeTime * 60);

        if (this.ticksSinceLastHit > 300) {
            shieldRecharge *= this.shieldRechargeAccelerator;
        }

        this.currentShield += shieldRecharge;
        if (this.currentShield > this.maxShield) {
            this.currentShield = this.maxShield;
        }
    }

    engage() {
        this.currentDelay += 1;

        if (this.currentDelay >= this.fireDelay) {
            this.currentDelay -= this.fireDelay;

            let actualProjectileAmount = this.projectileAmount;
            let projectileAmountCompensation = 0;

            if (this.projectileAmount > 10) {
                projectileAmountCompensation = (this.projectileAmount - 10) / 10;
                actualProjectileAmount = 10;
            }

            for (let i = 1; i <= actualProjectileAmount; i++){
                let radius = this.width/2;
                let angle =  Math.PI/(actualProjectileAmount+1) * i + Math.PI;
                let x = Math.cos(angle) * radius + this.x + this.width/2;
                let y = Math.sin(angle) * radius + this.y + this.height/2;

                let vx = 0;
                if (actualProjectileAmount > 1) {
                    vx = this.projectileSpread / (actualProjectileAmount - 1) * (i-1) - this.projectileSpread/2;
                }
                let vy = -5;

                let projectileDamage = this.projectileDamage + this.projectileDamage * projectileAmountCompensation;
                let criticalHit = (this.criticalHitChance > Math.random() * 100);
                if (criticalHit) {
                    projectileDamage *= this.criticalHitDamage;
                }
                this.spawner.spawnPlayerProjectile(x, y, vx, vy, projectileDamage);
            }
        }
    }

    hit(projectile) {

        this.ticksSinceLastHit = 0;

        // first hit shield, then armor, then structure
        let damage = projectile.damage * 1/this.repulsorField;
        if (this.currentShield >= damage) {
            this.currentShield -= damage;
            return;
        } else {
            // Check for overshield
            if (this.currentShield === this.maxShield) {
                let overshield = (this.overshieldChance > Math.random() * 100);
                if (overshield) {
                    this.currentShield = 0;
                    return;
                }
            }
            damage -= this.currentShield;
            this.currentShield = 0;
        }

        damage -= this.armorPlating;
        if (damage <= 0) {
            return;
        }

        if (this.currentArmor >= damage) {
            this.currentArmor -= damage;
            return;
        } else {
            damage -= this.currentArmor;
            this.currentArmor = 0;
        }

        if (damage < this.currentStructure) {
            this.currentStructure -= damage;
        } else {
            arcInc.sceneManager.scenes['main'].reset();
            arcInc.sceneManager.loadScene('main');
        }
    }
}