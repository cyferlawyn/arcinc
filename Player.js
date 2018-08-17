class Player extends PIXI.Sprite {
    constructor(texture, arcInc, spawner, boundaryWidth, boundaryHeight) {
        super(texture);

        this.arcInc = arcInc;
        this.spawner = spawner;
        this.boundaryWidth = boundaryWidth;
        this.boundaryHeight = boundaryHeight;

        this.credits = 0;

        this.upgrades = {
            'movementSpeed': {
                'title': 'Movement\n   Speed',
                'baseValue': 5,
                'effect': 0.05,
                'cost': 10,
            },
            'maxShield': {
                'title': ' Shield\nAmount',
                'baseValue': 150,
                'effect': 0.05,
                'cost': 10,
            },
            'shieldRechargeTime': {
                'title': '  Shield\nRecharge',
                'baseValue': 600,
                'effect': 0.05,
                'cost': 10,
            },
            'maxArmor': {
                'title': ' Armor\nAmount',
                'baseValue': 100,
                'effect': 0.05,
                'cost': 10,
            },
            'maxStructure': {
                'title': 'Structure\n Amount',
                'baseValue': 50,
                'effect': 0.05,
                'cost': 10,
            },
            'projectileDamage': {
                'title': 'Projectile\n Damage',
                'baseValue': 5,
                'effect': 0.05,
                'cost': 10,
            },
            'projectileVelocity': {
                'title': 'Projectile\n Velocity',
                'baseValue': 3,
                'effect': 0.05,
                'cost': 10,
            },
            'projectileAmount': {
                'title': 'Projectile\n Amount',
                'baseValue': 1,
                'effect': 1,
                'cost': 1000,
            },
            'rateOfFire': {
                'title': 'Rate of\n   Fire',
                'baseValue': 1,
                'effect': 0.05,
                'cost': 10,
            },
        };

        this.applyUpgrades();
    }

    applyUpgrades() {
        this.movementSpeed = this.upgrades['movementSpeed'].baseValue * (1 + this.upgrades['movementSpeed'].effect * this.arcInc.savegame.upgrades['movementSpeed']);

        this.maxShield = this.upgrades['maxShield'].baseValue * (1 + this.upgrades['maxShield'].effect * this.arcInc.savegame.upgrades['maxShield']);
        this.currentShield = this.maxShield;

        this.shieldRechargeTime = this.upgrades['shieldRechargeTime'].baseValue / (1 + this.upgrades['shieldRechargeTime'].effect * this.arcInc.savegame.upgrades['shieldRechargeTime']);

        this.maxArmor = this.upgrades['maxArmor'].baseValue * (1 + this.upgrades['maxArmor'].effect * this.arcInc.savegame.upgrades['maxArmor']);
        this.currentArmor = this.maxArmor;

        this.maxStructure = this.upgrades['maxStructure'].baseValue * (1 + this.upgrades['maxStructure'].effect * this.arcInc.savegame.upgrades['maxStructure']);
        this.currentStructure = this.maxStructure;

        this.projectileDamage = this.upgrades['projectileDamage'].baseValue * (1 + this.upgrades['projectileDamage'].effect * this.arcInc.savegame.upgrades['projectileDamage']);

        this.projectileVelocity = this.upgrades['projectileVelocity'].baseValue * (1 + this.upgrades['projectileVelocity'].effect * this.arcInc.savegame.upgrades['projectileVelocity']);

        this.projectileAmount = this.upgrades['projectileAmount'].baseValue * (1 + this.upgrades['projectileAmount'].effect * this.arcInc.savegame.upgrades['projectileAmount']);

        this.rateOfFire = this.upgrades['rateOfFire'].baseValue * (1 + this.upgrades['rateOfFire'].effect * this.arcInc.savegame.upgrades['rateOfFire']);
        this.fireDelay = 60 / this.rateOfFire;
        this.currentDelay = 0;
    }

    update(frame, mousePosition) {
        this.move(mousePosition);
        this.regenerate();
        this.engage();
    }

    move(mousePosition) {
        let pX = this.x + this.width/2;
        let pY = this.y + this.height/2;

        // To prevent costly calculations in case the player is already very close to the cursor, start with a check
        if (Math.abs(pX - mousePosition.x)  < this.movementSpeed && Math.abs(pY - mousePosition.y)  < this.movementSpeed) {
            this.position.set(mousePosition.x - this.width/2, mousePosition.y - this.height/2);
        } else {

            let distanceX = mousePosition.x - pX;
            let distanceY = mousePosition.y - pY;

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

    regenerate() {
        this.currentShield += this.maxShield / (this.shieldRechargeTime * 60);
        if (this.currentShield > this.maxShield) {
            this.currentShield = this.maxShield;
        }
    }

    engage() {
        this.currentDelay += 1;

        if (this.currentDelay >= this.fireDelay) {
            this.currentDelay -= this.fireDelay;
            for (let i = 1; i <= this.projectileAmount; i++){
                let radius = this.width/2;
                let angle =  Math.PI/(this.projectileAmount+1) * i + Math.PI;
                let x = Math.cos(angle) * radius + this.x + this.width/2;
                let y = Math.sin(angle) * radius + this.y + this.height/2;

                // calculate the velocity
                let pX = this.x + this.width/2;
                let pY = this.y + this.height/2;

                let distanceX = x - pX;
                let distanceY = y - pY;

                // calculate the velocity vector length
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // normalize velocity vector length
                let vx = distanceX / distance;
                let vy = distanceY / distance;

                vx *= this.projectileVelocity;
                vy *= this.projectileVelocity;

                this.spawner.spawnPlayerProjectile(x, y, vx, vy, this.projectileDamage);
            }
        }
    }

    hit(projectile) {
        // first hit shield, then armor, then structure
        let damage = projectile.damage;

        if (this.currentShield >= damage) {
            this.currentShield -= damage;
            return;
        } else {
            damage -= this.currentShield;
            this.currentShield = 0;
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
            // Oops, you are dead. Back to station with ya. Or more like upgrades scene, for now.
            arcInc.sceneManager.loadScene('upgrade');
        }
    }

    upgrade(upgrade) {
        this.arcInc.savegame.upgrades[upgrade] += 1;
        this.arcInc.saveSavegame();
        this.applyUpgrades();
    }
}