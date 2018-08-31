class Player extends PIXI.Sprite {
    constructor(texture, spawner, boundaryWidth, boundaryHeight) {
        super(texture);

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
                'effect': 0.99,
                'cost': 5000,
                'description': 'Reduces all incoming damage by a relative amount<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Damage taken: (Damage / [Repulsor Field]) - [Current Shield] - ([Armor Plating] * [Titanium Alloy]) - [Current Armor] - [Current Structure])'
            },
            'rateOfFire': {
                'title': 'Rate of Fire',
                'baseValue': 1,
                'effect': 0.035,
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
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 5) / 5)'
            },
            'clusterAmmunition': {
                'title': 'Cluster Ammunition',
                'baseValue': 1,
                'effect': 0.1,
                'cost': 500000,
                'description': 'Increases the projectile damage<br/><br/>' +
                    'Value: 1 + 0.1 * level<br/><br/>' +
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 5) / 5)'
            },
            'projectileAmount': {
                'title': 'Projectile Amount',
                'baseValue': 1,
                'effect': 1,
                'cost': 5000,
                'description': 'Increases the amount of projectiles to up to 5. Subsequent levels instead increase the projectile damage further<br/><br/>' +
                    'Value: 1 + 0.05 * level<br/><br/>' +
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 5) / 5)'
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
                    'Projectile Damage: 10 * [Projectile Damage] * [Cluster Ammunition] * [Critical Hit Damage] * (([Projectile Amount] - 5) / 5)'
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

        this.spawner = spawner;
        this.boundaryWidth = boundaryWidth;
        this.boundaryHeight = boundaryHeight;

        this.stats = new PlayerStats();

        this.destination = null;

        this.applyUpgrades();

        this.currentDelay = 0;
        this.ticksSinceLastHit = 0;
        this.currentShield = this.stats.effectiveMaxShield;
        this.currentArmor = this.stats.effectiveMaxArmor;
        this.currentStructure = this.stats.effectiveMaxStructure;
    }

    applyUpgrades() {
        this.stats.calculate();
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
            if (Math.abs(pX - this.destination.x / arcInc.pixiApp.stage.scale.x) < this.stats.effectiveMovementSpeed && Math.abs(pY - this.destination.y / arcInc.pixiApp.stage.scale.y) < this.stats.effectiveMovementSpeed) {
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
                this.vx = this.vx * this.stats.effectiveMovementSpeed;
                this.vy = this.vy * this.stats.effectiveMovementSpeed;

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
        if (this.ticksSinceLastHit > 300) {
            this.currentShield += this.stats.effectiveShieldRechargePerTickOutOfCombat;
        } else {
            this.currentShield += this.stats.effectiveShieldRechargePerTickInCombat;
        }

        // clamp current shield
        this.currentShield = Math.min(this.stats.effectiveMaxShield, this.currentShield);
    }

    engage() {
        this.currentDelay += 1;

        if (this.currentDelay >= this.stats.effectiveFireDelayInTicks) {
            this.currentDelay -= this.stats.effectiveFireDelayInTicks;

            for (let i = 1; i <= this.stats.effectiveProjectileAmount; i++){
                let radius = this.width/2;
                let angle =  Math.PI/(this.stats.effectiveProjectileAmount+1) * i + Math.PI;
                let x = Math.cos(angle) * radius + this.x + this.width/2;
                let y = Math.sin(angle) * radius + this.y + this.height/2;

                let vx = 0;
                if (this.stats.effectiveProjectileAmount > 1) {
                    vx = this.stats.effectiveProjectileSpread / (this.stats.effectiveProjectileAmount - 1) * (i-1) - this.stats.effectiveProjectileSpread/2;
                }
                let vy = -5;

                let projectileDamage = this.stats.effectiveProjectileDamage;
                this.spawner.spawnPlayerProjectile(x, y, vx, vy, projectileDamage);
            }
        }
    }

    hits(enemy, projectile) {
        let damage = projectile.damage;

        // test critical hit
        if (this.stats.chanceHappened('criticalHitChance')) {
            damage *= this.stats.effectiveCriticalHitDamageMultiplier;
        }

        // test projectile fork
        if (this.stats.chanceHappened('projectileForkChance')) {
            projectile.ignore.push(enemy.id);
            let newProjectileOne = arcInc.sceneManager.scenes['main'].spawner.spawnPlayerProjectile(projectile.x, projectile.y, projectile.vy / 4, projectile.vy, projectile.damage);
            let newProjectileTwo = arcInc.sceneManager.scenes['main'].spawner.spawnPlayerProjectile(projectile.x, projectile.y, -projectile.vy / 4, projectile.vy, projectile.damage);
            newProjectileOne.ignore = projectile.ignore.slice();
            newProjectileTwo.ignore = projectile.ignore.slice();
        }

        // test projectile pierce
        if (this.stats.chanceHappened('projectilePierceChance')) {
            projectile.ignore.push(enemy.id);
        } else {
            projectile.visible = false;
        }

        // Skip ailment calculations for direct kills
        if (enemy.currentHealth > damage) {
            // test freeze
            if (this.stats.chanceHappened('freezeChance')) {
                enemy.vx = enemy.vx * 0.98;
                enemy.vy = enemy.vy * 0.98;
            }

            // test burn
            if (this.stats.chanceHappened('burnChance')) {
                enemy.burnDamage += damage * 0.01;
            }
        }

        // Apply final damage application
        enemy.currentHealth -= damage;
        enemy.checkForDestruction();
    }

    isHit(projectile) {
        // Reset out of combat timer
        this.ticksSinceLastHit = 0;

        // Take the unmodified projectile damage
        let damage = projectile.damage;

        // free projectile again
        projectile.visible = false;

        // Apply relative multiplier
        damage *=  this.stats.effectiveRelativeIncomingDamageMultiplier;

        // first hit shield
        damage += this.stats.effectiveAbsoluteIncomingShieldDamageAddition;
        if (this.currentShield >= damage) {
            this.currentShield -= damage;
            return;
        } else {
            // Check for overshield
            if (this.currentShield === this.stats.effectiveMaxShield) {
                if (this.stats.chanceHappened('overshieldChance')) {
                    this.currentShield = 0;
                    return;
                }
            }
            damage -= this.currentShield;
            this.currentShield = 0;
        }

        // second hit armor
        damage += this.stats.effectiveAbsoluteIncomingArmorDamageAddition;
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

        // lastly hit structure
        damage += this.stats.effectiveAbsoluteIncomingStructureDamageAddition;
        if (damage < this.currentStructure) {
            this.currentStructure -= damage;
        } else {
            arcInc.sceneManager.scenes['main'].reset();
            arcInc.sceneManager.loadScene('main');
        }
    }
}