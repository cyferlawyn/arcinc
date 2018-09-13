class WaveTemplateStore {
    static fromBitMask(mask, type, lastWave) {
        let keyFrames = [];

        let wavesToSpawn = 1;
        if (lastWave < arcInc.antimatterTalents.waveCompressionThreshold)
        {
            wavesToSpawn = arcInc.antimatterTalents.waveCompressionStrength;
        }
        let targetWave = lastWave + wavesToSpawn;

        arcInc.sceneManager.scenes['main'].wave += wavesToSpawn;

        let bossScalingFactor= 0;
        for (let currentWave = lastWave + 1; currentWave <= targetWave; currentWave++) {
            if (currentWave % 10 === 0){
                bossScalingFactor += 50;
            }
            if (currentWave % 100 === 0){
                bossScalingFactor += 250;
            }
            if (currentWave % 1000 === 0){
                bossScalingFactor += 1250;
            }
        }

        if (bossScalingFactor > 0) {
            keyFrames.push(new KeyFrame(150, {"operation": "spawnBoss", "reference": "Boss", "type": "boss", "scalingFactor": bossScalingFactor, "wave": targetWave}));
        }

        for (let i = mask.length - 1; i >= 0; i--) {
            for (let j = 0; j < mask[i].length; j++) {
                if (mask[i][j] === "*") {
                    let frame = ((mask.length) - i) * (300/(mask.length));
                    let x = 1 / (mask[i].length+1) * (j+1);
                    keyFrames.push(new KeyFrame(frame, {"operation": "spawnEnemy", "reference": type + ((j + 1) * (i + 1)), "type": type, "wave": targetWave, "scalingFactor": wavesToSpawn, "x": x, "y": -0.25, "vx": 0, "vy": 2}));
                }
            }
        }

        keyFrames.sort(function(a,b) {return (a.frame > b.frame) ? 1 : ((b.frame > a.frame) ? -1 : 0);} );

        return new WaveTemplate(keyFrames);
    }

    /*
    static template1(wave) {
        let keyFrames = [];

        for (let i = 0; i < 25; i++) {
            let frame = Math.floor(i/5) * 50;
            let x = i%5 * 0.1 + 0.3;
            keyFrames.push(new KeyFrame(frame, {"operation": "spawnEnemy", "reference": "crawler" + i+1, "type": "crawler", "wave": wave, "x": x, "y": -0.25, "vx": 0, "vy": 2}));
        }

        for (let i = 0; i < 5; i++) {
            let frame = i * 100;
            if (i%2 === 1) {
                keyFrames.push(new KeyFrame(frame, {"operation": "spawnEnemy", "reference": "asteroid" + i+1, "type": "asteroid", "wave": wave, "x": -0.25, "y": -0.25, "vx": 4, "vy": 4}));
            } else {
                keyFrames.push(new KeyFrame(frame, {"operation": "spawnEnemy", "reference": "asteroid" + i+1, "type": "asteroid", "wave": wave, "x": 1.25, "y": -0.25, "vx": -4, "vy": 4}));
            }
        }

        keyFrames.sort(function(a,b) {return (a.frame > b.frame) ? 1 : ((b.frame > a.frame) ? -1 : 0);} );

        return new WaveTemplate(keyFrames);
    };*/

    static template(wave) {

        let type = ["crawler", "industrialMiner", "suicideBomber"];
        return WaveTemplateStore.fromBitMask(Formation.formations[Math.floor(Math.random() * Formation.formations.length)],
            type[Math.floor(Math.random() * type.length)],
            wave);
    };
}