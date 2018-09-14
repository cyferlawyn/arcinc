class Backend {
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
        xhr.open("POST", backendAddress + '/user/create', true);
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
        xhr.open("POST", backendAddress + '/user/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    saveUser(authToken, savegame) {
        let requestBody = {
            'authToken': authToken,
            'savegame': savegame
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", backendAddress + '/user/save', true);
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
                    let savegame = response['savegame'];
                    savegame.credits = Math.round(parseFloat(savegame.credits));
                    savegame.activeAntimatter = Math.round(parseFloat(savegame.activeAntimatter));
                    savegame.pendingAntimatter = Math.round(parseFloat(savegame.pendingAntimatter));
                    savegame.refiner.bufferVolume = Math.round(parseFloat(savegame.refiner.bufferVolume));
                    savegame.refiner.offensiveRefinedAntimatter = Math.round(parseFloat(savegame.refiner.offensiveRefinedAntimatter));
                    savegame.refiner.defensiveRefinedAntimatter = Math.round(parseFloat(savegame.refiner.defensiveRefinedAntimatter));
                    successCallback(savegame);
                }
                else {
                    failureCallback();
                }
            }
        };
        xhr.open("POST", backendAddress + '/user/load', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    sendChat(authToken, text) {
        let requestBody = {
            'authToken': authToken,
            'text': text
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", backendAddress + '/chat/send', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestBody));
    }

    receiveChat(callback) {
        if (typeof(EventSource) !== 'undefined') {
            let eventSource = new EventSource(backendAddress + '/chat/receive');

            eventSource.onmessage = event => {
                let chatEntry = JSON.parse(event.data);
                callback(chatEntry.time, chatEntry.name, chatEntry.text);
            }
        } else {
            alert('Event Source is not supported in your browser, please be patient till the dev provides an alternative. For now, chat is disabled :(')
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

        xhr.open('GET', backendAddress + '/user/leaderboard', true);
        xhr.send();
    }
}