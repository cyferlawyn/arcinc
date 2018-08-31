class Player extends PIXI.Sprite {
    constructor(texture, spawner, boundaryWidth, boundaryHeight) {
        super(texture);

        this.upgrades = {
            'movementSpeed': {
                'title': 'Movement Speed',
                'cost': 10,
                'description': 'Increases the Movement Speed',
                'valueTemplate': 'VALUE pixel/tick'
            },
            'maxShield': {
                'title': 'Shield Amount',
                'cost': 25,
                'description': 'Increases the Maximum Shield',
                'valueTemplate': 'VALUEx multiplier'
            },
            'plasmaField': {
                'title': 'Plasma Field',
                'cost': 500000,
                'description': 'Increases the Maximum Shield',
                'valueTemplate': 'VALUEx multiplier'
            },
            'shieldRechargeTime': {
                'title': 'Shield Recharge',
                'cost': 25,
                'description': 'Decreases the Shield Recharge Time (<i>Aka increases the shield regeneration per frame</i>)',
                'valueTemplate': 'VALUEx multiplier'
            },
            'shieldRechargeAccelerator': {
                'title': 'Shield Recharge Accelerator',
                'cost': 5000,
                'description': 'When not being hit for 300 frames, decreases the Shield Recharge Time substantially (<i>Aka increases the shield regeneration per frame</i>)',
                'valueTemplate': 'VALUEx multiplier'
            },
            'overshieldChance': {
                'title': 'Overshield Chance',
                'cost': 100000,
                'description': 'Chance that a hit is fully absorbed by the shield without affecting armor or structure. ' +
                    'Requires full shield to trigger and will deplete the whole shield bar',
                'valueTemplate': 'VALUE% chance',
                'cap': 400
            },
            'maxArmor': {
                'title': 'Armor Amount',
                'cost': 25,
                'description': 'Increases the Maximum Armor',
                'valueTemplate': 'VALUEx multiplier'
            },
            'armorPlating': {
                'title': 'Armor Plating',
                'cost': 25000,
                'description': 'Reduces armor and structure damage taken by an absolute value',
                'valueTemplate': 'VALUE abs. reduction'
            },
            'titaniumAlloy': {
                'title': 'Titanium Alloy',
                'cost': 500000,
                'description': 'Increases the Maximum Armor',
                'valueTemplate': 'VALUEx multiplier'
            },
            'maxStructure': {
                'title': 'Structure Amount',
                'cost': 25,
                'description': 'Increases the Maximum Structure',
                'valueTemplate': 'VALUEx multiplier'
            },
            'repulsorField': {
                'title': 'Repulsor Field',
                'cost': 5000,
                'description': 'Reduces all incoming damage by a relative amount',
                'valueTemplate': 'VALUEx multiplier'
            },
            'rateOfFire': {
                'title': 'Rate of Fire',
                'cost': 50,
                'description': 'Increases the projectile fire rate',
                'valueTemplate': 'VALUE shots/60ticks'
            },
            'projectileDamage': {
                'title': 'Projectile Damage',
                'cost': 50,
                'description': 'Increases the projectile damage',
                'valueTemplate': 'VALUEx multiplier'
            },
            'clusterAmmunition': {
                'title': 'Cluster Ammunition',
                'cost': 500000,
                'description': 'Increases the projectile damage',
                'valueTemplate': 'VALUEx multiplier'
            },
            'projectileAmount': {
                'title': 'Projectile Amount',
                'cost': 5000,
                'description': 'Increases the amount of projectiles to up to 5. Subsequent levels instead increase the projectile damage further',
                'valueTemplate': 'VALUEx multiplier'
            },
            'projectileSpread': {
                'title': 'Projectile Spread',
                'cost': 5000,
                'description': 'Increases the spread in case more than 1 projectile is fired at once',
                'valueTemplate': 'VALUEx multiplier'
            },
            'criticalHitChance': {
                'title': 'Critical Hit Chance',
                'cost': 10000,
                'description': 'Chance to perform a critical hit',
                'valueTemplate': 'VALUE% chance',
                'cap': 400
            },
            'criticalHitDamage': {
                'title': 'Critical Hit Damage',
                'cost': 10000,
                'description': 'Increases the damage dealt when performing a critical hit',
                'valueTemplate': 'VALUEx multiplier'
            },
            'projectilePierceChance': {
                'title': 'Projectile Pierce Chance',
                'cost': 25000,
                'description': 'Chance that the projectile is not consumed upon impact. Can not hit the same enemy multiple times',
                'valueTemplate': 'VALUE% chance',
                'cap': 400
            },
            'projectileForkChance': {
                'title': 'Projectile Fork Chance',
                'cost': 25000,
                'description': 'Chance that the projectile is split into 3 upon impact. Can not hit the same enemy multiple times',
                'valueTemplate': 'VALUE% chance',
                'cap': 400
            },
            'freezeChance': {
                'title': 'Freeze Chance',
                'cost': 100000,
                'description': 'Chance that the enemy is frozen, which reduces his movement speed by 2% per hit. Stacks multiplicative',
                'valueTemplate': 'VALUE% chance',
                'cap': 400
            },
            'burnChance': {
                'title': 'Burn Chance',
                'cost': 500000,
                'description': 'Chance that the enemy catches fire upon impact, dealing 1% of [Projectile Damage] each tick. Stacks additive',
                'valueTemplate': 'VALUE% chance',
                'cap': 400
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