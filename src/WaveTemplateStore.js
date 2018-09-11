class WaveTemplateStore {
    static fromBitMask(mask, type, wave, compress) {
        let keyFrames = [];
        let repetitions = 1;
        if (compress) {
            repetitions = 10;
        }

        for (let rep = 1; rep <= repetitions; rep++) {
            if (wave % 10 === 0 && rep === 1) {
                if (wave % 1000 === 0) {
                    keyFrames.push(new KeyFrame(150, {"operation": "spawnBoss", "reference": "Boss", "type": "bossX000", "wave": wave}));
                } else if (wave % 100 === 0) {
                    keyFrames.push(new KeyFrame(150, {"operation": "spawnBoss", "reference": "Boss", "type": "bossX00", "wave": wave}));
                }else {
                    keyFrames.push(new KeyFrame(150, {"operation": "spawnBoss", "reference": "Boss", "type": "bossX0", "wave": wave}));
                }
            } else {
                for (let i = mask.length - 1; i >= 0; i--) {
                    for (let j = 0; j < mask[i].length; j++) {
                        if (mask[i][j] === "*") {
                            let frame = ((mask.length * rep) - i) * (300/(mask.length * repetitions));
                            let x = 1 / (mask[i].length+1) * (j+1);
                            keyFrames.push(new KeyFrame(frame, {"operation": "spawnEnemy", "reference": type + ((j + 1) * (i + 1)), "type": type, "wave": wave, "x": x, "y": -0.25, "vx": 0, "vy": 2}));
                        }
                    }
                }
            }
        }

        let asteroidCount = Math.max(1, Math.floor(Math.random() * 30));
        for (let i = 0; i < asteroidCount; i++) {
            let frame = i * (300/asteroidCount) + 150;
            let x = Math.random() * 2 - 0.5;

            let vx = 4 * (0.5 - x);
            keyFrames.push(new KeyFrame(frame, {"operation": "spawnEnemy", "reference": "asteroid" + i+1, "type": "asteroid", "wave": wave, "x": x, "y": -0.25, "vx": vx, "vy": 4}));
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

    static template(wave, compress) {

        let type = ["crawler", "industrialMiner", "suicideBomber"];
        return WaveTemplateStore.fromBitMask(Formation.formations[Math.floor(Math.random() * Formation.formations.length)],
            type[Math.floor(Math.random() * type.length)],
            wave,
            compress);
    };
}