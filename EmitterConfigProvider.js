class EmitterConfigProvider {
    static parseColor(color) {
        if (typeof color === 'number') {
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        }

        return color;
    };

    static getPlayerProjectileTrail(tint) {
        return {
            "alpha": {
                "start": 0.075,
                "end": 0
            },
            "scale": {
                "start": 0.5,
                "end": 1.5,
                "minimumScaleMultiplier": 1
            },
            "color": {
                "start": this.parseColor(tint),
                "end": this.parseColor(tint)
            },
            "speed": {
                "start": 300,
                "end": 3000,
                "minimumSpeedMultiplier": 1
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 80,
                "max": 100
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.02,
                "max": 0.20
            },
            "frequency": 0.02,
            "emitterLifetime": 1,
            "maxParticles": 15,
            "pos": {
                "x": 0,
                "y": -4
            },
            "addAtBack": true,
            "spawnType": "point"
        };
    }

    static getEnemyProjectileTrail(tint) {
        return {
            "alpha": {
                "start": 0.075,
                "end": 0
            },
            "scale": {
                "start": 0.5,
                "end": 1.5,
                "minimumScaleMultiplier": 1
            },
            "color": {
                "start": this.parseColor(tint),
                "end": this.parseColor(tint)
            },
            "speed": {
                "start": 300,
                "end": 3000,
                "minimumSpeedMultiplier": 1
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 260,
                "max": 280
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 0
            },
            "lifetime": {
                "min": 0.02,
                "max": 0.20
            },
            "frequency": 0.005,
            "emitterLifetime": 1,
            "maxParticles": 100,
            "pos": {
                "x": 0,
                "y": 4
            },
            "addAtBack": true,
            "spawnType": "point"
        };
    }
}

let emitterConfigsmokeTrail = {
    "alpha": {
        "start": 0.075,
        "end": 0
    },
    "scale": {
        "start": 0.5,
        "end": 1.5,
        "minimumScaleMultiplier": 1
    },
    "color": {
        "start": "#23f206",
        "end": "#23f206"
    },
    "speed": {
        "start": 300,
        "end": 3000,
        "minimumSpeedMultiplier": 1
    },
    "acceleration": {
        "x": 0,
        "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 80,
        "max": 100
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0,
        "max": 0
    },
    "lifetime": {
        "min": 0.02,
        "max": 0.20
    },
    "frequency": 0.005,
    "emitterLifetime": 1,
    "maxParticles": 100,
    "pos": {
        "x": 0,
        "y": -4
    },
    "addAtBack": true,
    "spawnType": "point"
};

let emitterConfigExplosion = {
    alpha: {
        list: [
            {
                value: 0.7,
                time: 0
            },
            {
                value: 0.2,
                time: 1
            }
        ],
        isStepped: false
    },
    scale: {
        list: [
            {
                value: 1,
                time: 0
            },
            {
                value: 0.1,
                time: 1
            }
        ],
        isStepped: false
    },
    color: {
        list: [
            {
                value: "#ff0003",
                time: 0
            },
            {
                value: "#dff508",
                time: 1
            }
        ],
        isStepped: false
    },
    speed: {
        list: [
            {
                value: 200,
                time: 0
            },
            {
                value: 1000,
                time: 1
            }
        ],
        isStepped: false
    },
    startRotation: {
        min: 0,
        max: 360
    },
    rotationSpeed: {
        min: 0,
        max: 0
    },
    lifetime: {
        min: 0.05,
        max: 0.2
    },
    frequency: 0.008,
    spawnChance: 1,
    particlesPerWave: 1,
    emitterLifetime: 0.2,
    maxParticles: 50,
    pos: {
        x: 10,
        y: 10
    },
    addAtBack: false,
    spawnType: "circle",
    spawnCircle: {
        x: 0,
        y: 0,
        r: 5
    }
};