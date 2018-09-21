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
            "acquisitionInterval": {
                "title": "Acquisition Interval",
                "cost": 1e6,
                "growthFactor": 10,
                "description": "Decreases the time between [Acquisition Automaton] activations.",
                "effectTemplate": "{EFFECT} s",
                "cap": 10
            },
            "acquisitionBulkBuy": {
                "title": "Acquisition Bulk Buy",
                "cost": 1e10,
                "growthFactor": 1000,
                "description": "Installs the Bulk Buy Module into the Acquisition Automaton. Each activation will try to buy multiple perks at once.",
                "effectTemplate": "{EFFECT} acquisitions"
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
            },
            "refinerOfflineVolume": {
                "title": "Refiner Offline Volume",
                "cost": 1e15,
                "growthFactor": 10,
                "description": "We are a 24/7 company now. Determines how much your night shift has to work before seeing their families again.",
                "effectTemplate": "{EFFECT} Antimatter"
            },
        };
    }

    calculate() {
        this.waveCompressionStrength = 1 + arcInc.savegame.talents.waveCompressionStrength;
        this.waveCompressionThreshold = Math.min(arcInc.savegame.highestWaveEver-200, 375 + 135 * arcInc.savegame.talents.waveCompressionThreshold);

        this.refinerCycleTime = 60 * 0.95**arcInc.savegame.talents.refinerCycleTime;
        this.refinerBufferVolume = 1e15 * 10**(2 * arcInc.savegame.talents.refinerBufferVolume);
        this.refinerCycleVolume = 1e14 * 11**arcInc.savegame.talents.refinerCycleVolume;
        this.refinerOfflineVolume = 1e17 * 11**arcInc.savegame.talents.refinerOfflineVolume;
        this.refinerPurity = 10 * 10**arcInc.savegame.talents.refinerPurity;

        this.acquisitionInterval = 1.1 - 0.1 * arcInc.savegame.talents.acquisitionInterval;
        this.acquisitionBulkBuy = 1 + arcInc.savegame.talents.acquisitionBulkBuy;
    }
}