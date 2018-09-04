class Chat {
    static prepare(parent) {
        let chat = CategoryCard.prepare(parent, 'chat', 'Chat');

        let chatLog = document.createElement('div');
        chatLog.id = 'chat-log';
        chatLog.style.maxHeight = '200px';
        chatLog.style.height = '200px';
        chatLog.style.overflowX = 'none';
        chatLog.style.overflowY = 'auto';
        chatLog.style.margin = '5px 0px';
        chat.appendChild(chatLog);

        let table = document.createElement('table');
        table.classList.add('table-sm', 'text-light', 'table-dark', 'bg-st-patricks-blue');
        chatLog.appendChild(table);

        let chatEntries = document.createElement('tbody');
        chatEntries.id = 'chat-entries';
        table.appendChild(chatEntries);

        arcInc.backend.receiveChat(Chat.onMessageReceived);

        let input = document.createElement('input');
        input.id = 'chatInput';
        input.classList.add('form-control', 'form-control-sm');
        input.type = 'text';
        input.addEventListener('keypress', Chat.onMessageSubmitted);
        chat.appendChild(input);
    }

    static onMessageSubmitted(event) {
        let text = event.target.value;
        let charCode = (typeof event.which === "number") ? event.which : event.keyCode;
        if (charCode === 13 && text.length > 0) {

            if (text === '/cls') {
                let chatEntries = document.querySelector('#chat-entries');
                while( chatEntries.hasChildNodes() ){
                    chatEntries.removeChild(chatEntries.lastChild);
                }
            } else if (text === '/logout') {
                localStorage.removeItem(authTokenName);
                localStorage.removeItem(savegameName);
                location.reload();
            } else {
                arcInc.backend.sendChat(arcInc.authToken, text);
            }
            event.target.value = '';
        }
    }

    static onMessageReceived(time, name, text) {
        if (name === 'Cyfer' && text === '/refresh') {
            location.reload();
        }

        let tableRow = document.createElement('tr');
        let chatEntries = document.querySelector('#chat-entries');
        chatEntries.appendChild(tableRow);

        let timeTableData = document.createElement('td');
        timeTableData.textContent = time;
        tableRow.appendChild(timeTableData);

        let nameTableData = document.createElement('td');
        nameTableData.textContent = name;
        tableRow.appendChild(nameTableData);

        let textTableData = document.createElement('td');
        textTableData.textContent = text;
        tableRow.appendChild(textTableData);

        // Scroll into view
        let chatLog = document.querySelector('#chat-log');
        chatLog.scrollTo(0,10000000);
    }
}