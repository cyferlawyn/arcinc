class ParticleEmitter extends PIXI.particles.Emitter {
    constructor() {
        super(arcInc.objectStore.get('particleContainer'),
            PIXI.Loader.shared.resources["assets/particles/Explosion.png"].texture,
            {
                "alpha": {
                    "start": 1,
                    "end": 0.18
                },
                "scale": {
                    "start": 0.015,
                    "end": 0.3,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#fffefe",
                    "end": "#ffffff"
                },
                "speed": {
                    "start": 50,
                    "end": 10,
                    "minimumSpeedMultiplier": 1
                },
                "acceleration": {
                    "x": 0,
                    "y": 0
                },
                "maxSpeed": 0,
                "startRotation": {
                    "min": 0,
                    "max": 360
                },
                "noRotation": false,
                "rotationSpeed": {
                    "min": 0,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.3,
                    "max": 0.8
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": 0.1,
                "maxParticles": 50,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": true,
                "spawnType": "point"
            });

        this.now = Date.now();
        this.elapsed = Date.now();
        this.emit = false;
        this.disabled = false;

        arcInc.eventEmitter.subscribe(Events.ENTITY_DESTROYED, 'ParticleEmitter', this.emitExplostion.bind(this));

        document.querySelector('#disable-particle').addEventListener('click', function() {
           if (this.checked) {
               arcInc.eventEmitter.unsubscribe(Events.ENTITY_DESTROYED, 'ParticleEmitter');
               this.disabled = true;
           }  else {
               let particleEmitter = arcInc.sceneManager.scenes['main'].particleEmitter;
               arcInc.eventEmitter.subscribe(Events.ENTITY_DESTROYED, 'ParticleEmitter', particleEmitter.emitExplostion.bind(particleEmitter));
               this.disabled = false;
           }
        });
    }

    update() {
        if (!this.disabled) {
            this.now = Date.now();

            super.update((this.now - this.elapsed) * 0.001);

            this.elapsed = this.now;
        }
    }

    emitExplostion(pos) {
        this.emit = true;
        this.resetPositionTracking();
        this.updateOwnerPos(pos.x, pos.y);
    }
}