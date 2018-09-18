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
                    player.currentEnergy -= this.energyConsumption * frameDelta;
                    player.currentArmor += player.stats.effectiveMaxArmor * frameDelta / 250;
                    if (player.currentArmor > player.stats.effectiveMaxArmor) {
                        // Player went over max armor, clamp the amount and refund wasted energy
                        let potentialReg = player.stats.effectiveMaxArmor * frameDelta / 250;
                        let actualReg = player.currentArmor - player.stats.effectiveMaxArmor;
                        player.currentEnergy += this.energyConsumption * frameDelta * (potentialReg / actualReg);
                        player.currentArmor = player.stats.effectiveMaxArmor;
                    }
                }
            }
        }
    }
}