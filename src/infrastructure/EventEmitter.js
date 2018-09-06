class EventEmitter {
    constructor() {
        this.events = [];
    }

    subscribe(event, id, callback) {
        if (this.events[event] === undefined) {
            this.events[event] = [];
        }

        this.events[event][id] = callback;
    }

    unsubscribe(event, id) {
        if (this.events[event] === undefined) {
            console.error(id + ' unsubscribed from a event stream that no-one ever subscribed to: ' + event);
            return;
        }

        delete this.events[event][id];
    }

    emit(event, payload) {
        if (this.events[event] === undefined) {
            //console.log('Emitted an event to an event stream that no-one ever subscribed to: ' + event);
            return;
        }
        Object.keys(this.events[event]).forEach(function(id) {
            arcInc.eventEmitter.events[event][id](payload);
        });
    }
}