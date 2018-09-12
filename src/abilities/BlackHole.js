class BlackHole extends Ability {
    constructor() {
        super();
        this.energyConsumption = 75;
        this.blackHoles = [];
    }

    update(frameDelta) {
        this.updateBlackHoles(frameDelta);

        if (this.active) {
            let player = arcInc.objectStore.get('player');
            if (player.currentEnergy >= this.energyConsumption) {
                player.currentEnergy -= this.energyConsumption;
                this.spawnBlackHole();
            }
            this.toggle();
        }
    }

    spawnBlackHole() {
        let playerContainer = arcInc.objectStore.get('playerContainer');
        let player = arcInc.objectStore.get('player');
        let blackHole= new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/BlackHole.png"].texture);
        blackHole.remainingFrames = 450;
        playerContainer.addChild(blackHole);

        blackHole.x = player.x + player.width/2 - blackHole.width/2;
        blackHole.y = player.y + player.height/2 - blackHole.height/2 - 250;
        blackHole.anchor.set(0.5, 0.5);
        this.blackHoles.push(blackHole);
    }

    updateBlackHoles(frameDelta) {
        let enemyContainer = arcInc.objectStore.get('enemyContainer');
        let enemyProjectileContainer = arcInc.objectStore.get('enemyProjectileContainer');

        for (let i = this.blackHoles.length - 1; i >= 0; i--) {
            let blackHole = this.blackHoles[i];
            blackHole.rotation +=  frameDelta / 45;
            blackHole.remainingFrames -= frameDelta;

            if (blackHole.remainingFrames < 0) {
                blackHole.destroy();
                this.blackHoles.splice(i, 1);
            } else {
                for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                    let enemy = enemyContainer.children[enemyIndex];
                    if (enemy.visible && !enemy.isBoss) {
                        let normVector = Utils.getNormVector(blackHole, enemy);
                        let distance = Utils.getDistance(blackHole, enemy);
                        if (distance > 75) {
                            enemy.x += normVector.vx * enemy.vy * 1.5 * (250 / Math.max(50, distance)) * frameDelta;
                            enemy.y += normVector.vy * enemy.vy * 1.5 * (250 / Math.max(50, distance)) * frameDelta;
                        }
                    }
                }

                for (let enemyProjectileIndex = enemyProjectileContainer.children.length - 1; enemyProjectileIndex >= 0; enemyProjectileIndex--) {
                    let enemyProjectile = enemyProjectileContainer.children[enemyProjectileIndex];
                    if (enemyProjectile.visible) {
                        let normVector = Utils.getNormVector(blackHole, enemyProjectile);
                        let distance = Utils.getDistance(blackHole, enemyProjectile);
                        if (distance > 75) {
                            enemyProjectile.x += normVector.vx * 10 * (75 / Math.max(25, distance)) * frameDelta;
                            enemyProjectile.y += normVector.vy * 10 * (75 / Math.max(25, distance)) * frameDelta;
                        }
                    }
                }
            }
        }
    }
}