class Ability {
    constructor() {
        this.active = false;
        this.button = null;
    }

    toggle() {
        this.active = !this.active;
        if (this.active) {
            this.button.tint = 0x88FF88;
        } else {
            this.button.tint = 0xFFFFFF;
        }
    }
}