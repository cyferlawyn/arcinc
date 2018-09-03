class ArmorRepairer extends Ability{
    constructor() {
        super();
        this.energyConsumption = 0.5;
    }

    update() {
        if (this.active) {
            // Convert energy to armor
            let player = arcInc.sceneManager.scenes['main'].objectStore.get('player');
            if (player.currentEnergy >= this.energyConsumption) {
                if (player.currentArmor < player.stats.effectiveMaxArmor) {
                    player.currentEnergy -= this.energyConsumption;
                    player.currentArmor += player.stats.effectiveMaxArmor / 250;
                    if (player.currentArmor > player.stats.effectiveMaxArmor) {
                        player.currentArmor = player.stats.effectiveMaxArmor;
                    }
                }
            }
        }
    }
}