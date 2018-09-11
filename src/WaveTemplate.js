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
                this.enemies[action.reference] = arcInc.spawner.spawnEnemy(action.type, action.wave);

                this.enemies[action.reference].x = Utils.getEffectiveScreenWidth() * action.x;
                this.enemies[action.reference].y = Utils.getEffectiveScreenHeight() * action.y;

                this.enemies[action.reference].vx = action.vx;
                this.enemies[action.reference].vy = action.vy;
            } else if (action.operation === "spawnBoss") {
                this.enemies[action.reference] = arcInc.spawner.spawnBoss(action.type, action.wave);
            }

            this.keyframes.splice(0, 1);
        }
    }
}