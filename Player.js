class Player extends PIXI.Sprite {
    constructor(texture, spawner, boundaryWidth, boundaryHeight) {
        super(texture);

        this.spawner = spawner;
        this.boundaryWidth = boundaryWidth;
        this.boundaryHeight = boundaryHeight;

        this.credits = 0;

        this.baseValues = {
            'movementSpeed': 5,
            'maxShield': 150,
            'shieldRechargeTime': 600,
            'maxArmor': 100,
            'maxStructure': 50,
            'projectileDamage': 5,
            'projectileVelocity': 3,
            'projectileAmount': 1,
            'rateOfFire': 1
        };

        this.upgradeEffects = {
            'movementSpeed': 0.05,
            'maxShield': 0.05,
            'shieldRechargeTime': 0.05,
            'maxArmor': 0.05,
            'maxStructure': 0.05,
            'projectileDamage': 0.05,
            'projectileVelocity': 0.05,
            'projectileAmount': 1,
            'rateOfFire': 0.05
        };

        this.upgrades = {
            'movementSpeed': 0,
            'maxShield': 0,
            'shieldRechargeTime': 0,
            'maxArmor': 0,
            'maxStructure': 0,
            'projectileDamage': 0,
            'projectileVelocity': 0,
            'projectileAmount': 0,
            'rateOfFire': 0
        };

        this.applyUpgrades();
    }

    applyUpgrades() {
        this.movementSpeed = this.baseValues['movementSpeed'] * (1 + this.upgradeEffects['movementSpeed'] * this.upgrades['movementSpeed']);

        this.maxShield = this.baseValues['maxShield'] * (1 + this.upgradeEffects['maxShield'] * this.upgrades['maxShield']);
        this.currentShield = this.maxShield;

        this.shieldRechargeTime = this.baseValues['shieldRechargeTime'] / (1 + this.upgradeEffects['shieldRechargeTime'] * this.upgrades['shieldRechargeTime']);

        this.maxArmor = this.baseValues['maxArmor'] * (1 + this.upgradeEffects['maxArmor'] * this.upgrades['maxArmor']);
        this.currentArmor = this.maxArmor;

        this.maxStructure = this.baseValues['maxStructure'] * (1 + this.upgradeEffects['maxStructure'] * this.upgrades['maxStructure']);
        this.currentStructure = this.maxStructure;

        this.projectileDamage = this.baseValues['projectileDamage'] * (1 + this.upgradeEffects['projectileDamage'] * this.upgrades['projectileDamage']);

        this.projectileVelocity = this.baseValues['projectileVelocity'] * (1 + this.upgradeEffects['projectileVelocity'] * this.upgrades['projectileVelocity']);

        this.projectileAmount = this.baseValues['projectileAmount'] * (1 + this.upgradeEffects['projectileAmount'] * this.upgrades['projectileAmount']);

        this.rateOfFire = this.baseValues['rateOfFire'] * (1 + this.upgradeEffects['rateOfFire'] * this.upgrades['rateOfFire']);
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

        this.currentStructure -= damage;

        if (this.currentStructure <= 0) {
            // Oops, you are dead. Back to station with ya. Or more like upgrades scene, for now.
            arcInc.sceneManager.loadScene('upgrade');

        }
    }

    upgrade(upgrade) {
        this.upgrades[upgrade] += 1;
        this.applyUpgrades();
    }
}