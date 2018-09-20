class ArmorRepairer extends Ability{
    constructor() {
        super();
        this.energyConsumption = 0.5;
    }

    update(frameDelta) {
        if (this.active) {
            // Convert energy to armor
            let player = arcInc.objectStore.get('player');
            if (player.currentEnergy >= this.energyConsumption * frameDelta) {
                if (player.currentArmor < player.stats.effectiveMaxArmor) {
                    let potentialReg = player.stats.effectiveMaxArmor * frameDelta / 250;
                    let actualReg = Math.min(potentialReg, player.stats.effectiveMaxArmor - player.currentArmor);
                    let utilization = actualReg / potentialReg;
                    player.currentEnergy -= this.energyConsumption * utilization * frameDelta;
                    player.currentArmor += actualReg;
                }
            }
        }
    }
}