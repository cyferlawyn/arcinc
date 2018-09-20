class WaveTemplate
{
    constructor(keyframes)
    {
        this.keyframes = keyframes;
        this.ticks = 0;
        this.enemies = {};
    }

    update(frameDelta)
    {
        this.ticks += frameDelta;


        while (this.keyframes.length > 0 && this.ticks >= this.keyframes[0].frame)
        {
            let action = this.keyframes[0].action;

            if (action.operation === "spawnEnemy") {
                this.enemies[action.reference] = arcInc.spawner.spawnEnemy(action.type, action.wave, action.scalingFactor);

                this.enemies[action.reference].x = Utils.getEffectiveScreenWidth() * action.x;
                this.enemies[action.reference].y = Utils.getEffectiveScreenHeight() * action.y;

                this.enemies[action.reference].vx = action.vx;
                this.enemies[action.reference].vy = action.vy;
            } else if (action.operation === "spawnBoss") {
                this.enemies[action.reference] = arcInc.spawner.spawnBoss(action.type, action.wave, action.scalingFactor);
            }

            this.keyframes.splice(0, 1);
        }

        let asteroidRoll = Math.random() * 1000;
        if (asteroidRoll < 5) {
            let x = Math.random() * 2 - 0.5;
            let vx = 4 * (0.5 - x);

            let asteroid = arcInc.spawner.spawnEnemy("asteroid", arcInc.sceneManager.scenes['main'].wave, 1);

            asteroid.x = Utils.getEffectiveScreenWidth() * (Math.random() * 2 - 0.5);
            asteroid.y = Utils.getEffectiveScreenHeight() * -0.25;

            asteroid.vx = 4 * (0.5 - x);
            asteroid.vy = 4;

            // Prevent asteroids from keeping the wave open
            asteroid.stats.wave = 0;
        }
    }
}