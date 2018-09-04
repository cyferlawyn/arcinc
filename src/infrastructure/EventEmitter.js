class EventEmitter {
    constructor() {
        this.events = [];
    }

    subscribe(event, callback) {
        if (this.events[event] === undefined) {
            this.events[event] = [];
        }

        this.events[event].push(callback);
    }

    unsubscribe(event, callback) {
        if (this.events[event] === undefined) {
            return;
        }

        this.events[event].splice(callback, 1);
    }

    emit(event, payload) {
        this.events[event].forEach(function(callback) {
            callback(payload);
        })
    }
}