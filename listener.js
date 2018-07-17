class Publisher {
    constructor() {
        this.listeners = [];
    }

    /**
     * Add a callback to be called when
     * the listener fires
     * 
     * @param {function} cb 
     */
    subscribe(cb) {
        this.listeners.push(cb);
    }

    /**
     * Remove a callback
     * 
     * @param {function} cb 
     */
    unsubscribe(cb) {
        for (let i = 0; i < this.listeners.length; i++) {
            if (cb == this.listeners[i]) {
                this.listeners.splice(i, 1);
            }
        }
    }

    /**
     * Publish to all listeners
     * 
     * @param {*} toPublish 
     */
    publish(toPublish) {
        this.listeners.map(cb => cb(toPublish));
    }

}