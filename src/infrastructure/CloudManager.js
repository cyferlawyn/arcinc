class CloudManager {
    static initLogin(loginRequired) {
        if (loginRequired) {
            let loginScreen = document.getElementById('login-screen');
            loginScreen.classList.remove('d-none');

            let registerButton = document.getElementById('register-button');
            registerButton.addEventListener('click', function() {
                let usernameInput = document.getElementById('username-input');
                let passwordInput = document.getElementById('password-input');

                let sha256 = new jsSHA('SHA-256', 'TEXT');
                sha256.update(passwordInput.value);
                let passwordHash = sha256.getHash("HEX");

                arcInc.backend.createUser(usernameInput.value, passwordHash, CloudManager.loginSucceeded, CloudManager.registerFailed);
            });

            let loginButton = document.getElementById('login-button');
            loginButton.addEventListener('click', function() {
                let usernameInput = document.getElementById('username-input');
                let passwordInput = document.getElementById('password-input');

                let sha256 = new jsSHA('SHA-256', 'TEXT');
                sha256.update(passwordInput.value);
                let passwordHash = sha256.getHash("HEX");

                arcInc.backend.loginUser(usernameInput.value, passwordHash, CloudManager.loginSucceeded, CloudManager.loginFailed);
            });
        } else {
            window.setInterval(CloudManager.cloudSave, 60000);
            arcInc.authenticated();
        }
    }

    static loginSucceeded(authToken) {
        localStorage.setItem(authTokenName, authToken);
        arcInc.authToken = authToken;
        arcInc.backend.loadUser(arcInc.authToken, function(savegame) {
            let savegameString = JSON.stringify(savegame);
            localStorage.setItem(savegameName, savegameString);
            location.reload();
        });

        window.setInterval(CloudManager.cloudSave, 60000);
        arcInc.authenticated();
    }

    static registerFailed() {
        let loginFeedback = document.querySelector('#login-feedback');
        loginFeedback.innerText = "Username already taken";
    }

    static loginFailed() {
        let loginFeedback = document.querySelector('#login-feedback');
        loginFeedback.innerText = "Password is either wrong or user does not exist";
    }

    static cloudSave() {
        let savegameString = JSON.stringify(arcInc.savegame, function(key, value) {
            if (key === 'credits' || key === 'activeAntimatter' || key === 'pendingAntimatter' ||
                key === "bufferVolume" || key === "offensiveRefinedAntimatter" || key === "defensiveRefinedAntimatter") {
                return value.toExponential();
            } else {
                return value;
            }
        });
        arcInc.backend.saveUser(arcInc.authToken, savegameString);
    }
}