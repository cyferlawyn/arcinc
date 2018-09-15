class AntimatterTalents {
    constructor() {
        this.talents = {
            "waveCompressionStrength": {
                "title": "Wave Compression Strength",
                "cost": 1,
                "growthFactor": 10,
                "description": "While your current wave is lower than [Wave Compression Threshold], the next wave will consist of [Wave Compression Strength] waves merged into a single stronger wave.",
                "effectTemplate": "{EFFECT} waves"
            },
            "waveCompressionThreshold": {
                "title": "Wave Compression Threshold",
                "cost": 1,
                "growthFactor": 10,
                "description": "While your current wave is lower than [Wave Compression Threshold], the next wave will consist of [Wave Compression Strength] waves merged into a single stronger wave.",
                "effectTemplate": "{EFFECT} waves"
            },
            "refinerBufferVolume": {
                "title": "Refiner Buffer Volume",
                "cost": 1e18,
                "growthFactor": 10,
                "description": "Increases the buffer size of the refiner.",
                "effectTemplate": "{EFFECT} Antimatter"
            },
            "refinerCycleTime": {
                "title": "Refiner Cycle Time",
                "cost": 1e20,
                "growthFactor": 100,
                "description": "Reduces the time the refiner needs for a refinement cycle.",
                "effectTemplate": "{EFFECT} seconds"
            },
            "refinerCycleVolume": {
                "title": "Refiner Cycle Volume",
                "cost": 1e18,
                "growthFactor": 10,
                "description": "Increases the refinement volume per cycle.",
                "effectTemplate": "{EFFECT} Antimatter"
            },
            "refinerPurity": {
                "title": "Refiner Purity",
                "cost": 1e15,
                "growthFactor": 1000,
                "description": "Increases the purity of the Refined Antimatter. The purer, the more power can be harnessed.",
                "effectTemplate": "{EFFECT} times purer"
            }
        };
    }

    calculate() {
        this.waveCompressionStrength = 1 + arcInc.savegame.talents.waveCompressionStrength;
        this.waveCompressionThreshold = Math.min(arcInc.savegame.highestWaveEver-200, 375 + 135 * arcInc.savegame.talents.waveCompressionThreshold);

        this.refinerBufferVolume = 1e15 * 10**(2 * arcInc.savegame.talents.refinerBufferVolume);
        this.refinerCycleTime = 60 * 0.95**arcInc.savegame.talents.refinerCycleTime;
        this.refinerCycleVolume = 1e13 * 10**arcInc.savegame.talents.refinerCycleVolume;
        this.refinerPurity = 10 * 10**arcInc.savegame.talents.refinerPurity;
    }
}