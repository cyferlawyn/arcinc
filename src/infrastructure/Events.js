class Events {
    static get CREDITS_UPDATED() {return 'creditsUpdated'};
    static get ANTIMATTER_UPDATED() {return 'antimatterUpdated'};
    static get HIGHEST_WAVE_REACHED() {return 'highestWaveReached'};
    static get STATION_MODULE_PURCHASED() {return 'stationModulePurchased'};
    static get ENTITY_DESTROYED() {return 'entityDestroyed'};

    // game phases
    static get CREATION_PHASE_STARTED() {return 'creationPhaseStarted'};
    static get REGENERATION_PHASE_STARTED() {return 'regenerationPhaseStarted'};
    static get MOVEMENT_PHASE_STARTED() {return 'movementPhaseStarted'};
    static get ENGAGEMENT_PHASE_STARTED() {return 'engagementPhaseStarted'};
    static get COLLISION_DETECTION_PHASE_STARTED() {return 'collisionDetectionPhaseStarted'};
    static get CLEANUP_PHASE_STARTED() {return 'cleanupPhaseStarted'};
}