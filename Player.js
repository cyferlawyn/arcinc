class Player extends PIXI.Sprite {
    constructor(texture, spawner, boundaryWidth, boundaryHeight) {
        super(texture);

        this.spawner = spawner;
        this.boundaryWidth = boundaryWidth;
        this.boundaryHeight = boundaryHeight;

        this.baseValues = {
            'movementSpeed': 5,
            'maxShield': 150,
            'maxArmor': 100,
            'maxStructure': 50,
            'rateOfFire': 1
        };

        this.upgradeEffects = {
            'movementSpeed': 0.05,
            'maxShield': 0.05,
            'maxArmor': 0.05,
            'maxStructure': 0.05,
            'rateOfFire': 0.05
        };
        this.upgrades = {
            'movementSpeed': 500,
            'maxShield': 500,
            'maxArmor': 500,
            'maxStructure': 500,
            'rateOfFire': 200
        };

        this.movementSpeed = this.baseValues['movementSpeed'] * (1 + this.upgradeEffects['movementSpeed'] * this.upgrades['movementSpeed']);

        this.maxShield = this.baseValues['maxShield'] * (1 + this.upgradeEffects['maxShield'] * this.upgrades['maxShield']);
        this.currentShield = this.maxShield;

        this.maxArmor = this.baseValues['maxArmor'] * (1 + this.upgradeEffects['maxArmor'] * this.upgrades['maxArmor']);
        this.currentArmor = this.maxArmor;

        this.maxStructure = this.baseValues['maxStructure'] * (1 + this.upgradeEffects['maxStructure'] * this.upgrades['maxStructure']);
        this.currentStructure = this.maxStructure;

        this.rateOfFire = this.baseValues['rateOfFire'] * (1 + this.upgradeEffects['rateOfFire'] * this.upgrades['rateOfFire']);
         console.log(this.rateOfFire);
        this.fireDelay = 60 / this.rateOfFire;
        this.currentDelay = 0;

        this.projectileAmount = 10;
        this.projectileVelocity = 10;

        this.shieldRechargeTime = 600;
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

                this.spawner.spawnPlayerProjectile(x, y, vx, vy);
            }

            //this.spawner.spawnPlayerProjectile(this.x + this.width/2 , this.y, this.projectileVelocity);
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

        if (damage > 0) {
            // Oops, you are dead. Reset stats, for now
            this.currentShield = this.maxShield;
            this.currentArmor = this.maxArmor;
            this.currentStructure = this.maxStructure;
        }
    }
}