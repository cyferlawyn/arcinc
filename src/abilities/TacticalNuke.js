class TacticalNuke extends Ability {
    constructor() {
        super();
        this.energyConsumption = 30;
        this.tacticalNukes = [];
    }

    update(frameDelta) {
        this.updateTacticalNukes(frameDelta);

        if (this.active) {
            let player = arcInc.objectStore.get('player');
            if (player.currentEnergy >= this.energyConsumption) {
                player.currentEnergy -= this.energyConsumption;
                this.spawnTacticalNuke();
            }
            this.toggle();
        }
    }

    spawnTacticalNuke() {
        let playerContainer = arcInc.objectStore.get('playerContainer');
        let player = arcInc.objectStore.get('player');
        let tacticalNuke = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/sprites/TacticalNuke.png"].texture);
        tacticalNuke.scale.set(0.5);
        playerContainer.addChild(tacticalNuke);

        tacticalNuke.x = player.x + player.width/2 - tacticalNuke.width/2;
        tacticalNuke.y = player.y + player.height/2 - tacticalNuke.height/2;
        this.tacticalNukes.push(tacticalNuke);

    }

    updateTacticalNukes(frameDelta) {
        let enemyContainer = arcInc.objectStore.get('enemyContainer');

        for (let i = this.tacticalNukes.length - 1; i >= 0; i--) {
            let tacticalNuke = this.tacticalNukes[i];
            tacticalNuke.y -= 4 * frameDelta;

            if (tacticalNuke.y < -100) {
                tacticalNuke.destroy();
                this.tacticalNukes.splice(i, 1);
                break;
            }

            for (let enemyIndex = enemyContainer.children.length - 1; enemyIndex >= 0; enemyIndex--) {
                let enemy = enemyContainer.children[enemyIndex];

                if (Utils.intersect(enemy, tacticalNuke)) {
                    enemy.stats.currentHealth *= 0.85;
                    tacticalNuke.destroy();
                    this.tacticalNukes.splice(i, 1);
                    break;
                }
            }
        }
    }
}