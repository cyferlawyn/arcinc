class Backend {
    constructor() {
        this.address = 'http://195.253.17.2:8081';
    }

    createUser(name, passwordHash, successCallback, failureCallback) {
        let requestBody = {
            'name': name,
            'passwordHash': passwordHash
        };

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    let response = JSON.parse(this.responseText);
                    successCallback(response['authToken']);
                }
                else {
                    failureCallback();
                }
            }
        };
        xhr.open("POST", this.address + '/user/create', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    loginUser(name, passwordHash, successCallback, failureCallback) {
        let requestBody = {
            'name': name,
            'passwordHash': passwordHash
        };

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    successCallback(response['authToken']);
                }
                else {
                    failureCallback();
                }
            }
        };
        xhr.open("POST", this.address + '/user/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    saveUser(authToken, savegame) {
        let requestBody = {
            'authToken': authToken,
            'savegame': savegame
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.address + '/user/save', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    loadUser(authToken, successCallback, failureCallback) {
        let requestBody = {
            'authToken': authToken
        };

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    successCallback(response['savegame']);
                }
                else {
                    failureCallback();
                }
            }
        };
        xhr.open("POST", this.address + '/user/load', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    sendChat(authToken, text) {
        let requestBody = {
            'authToken': authToken,
            'text': text
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.address + '/chat/send', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    receiveChat(callback) {
        let eventSource = new EventSource(this.address + '/chat/receive');

        eventSource.onmessage = event => {
            let chatEntry = JSON.parse(event.data);
            callback(chatEntry.time, chatEntry.name, chatEntry.text);
        }
    }

    getLeaderboard(callback) {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let response = JSON.parse(this.responseText);
                    callback(response);
                }
            }
        };

        xhr.open('GET', this.address + '/user/leaderboard', true);
        xhr.send();
    }
}