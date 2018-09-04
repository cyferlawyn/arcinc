class ObjectStore {
    constructor() {
        this.store = [];
    }

    put(name, object) {
        this.store[name] = object;
    }

    get(name) {
        return this.store[name];
    }
}