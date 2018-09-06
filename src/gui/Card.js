class Card {
    static prepare(parent, category, name, headerText, description, bodyText, anchorText, callback) {
        let card = document.createElement('div');
        card.id = name + '-card';
        card.classList.add('card', 'bg-st-patricks-blue');
        parent.appendChild(card);

        let cardHeader = document.createElement('div');
        cardHeader.id = name + '-card-header';
        cardHeader.classList.add('card-header', 'bg-st-patricks-blue', 'd-flex', 'justify-content-between');
        card.appendChild(cardHeader);

        let cardHeaderParagraph = document.createElement('h5');
        cardHeaderParagraph.innerText = headerText;
        cardHeader.appendChild(cardHeaderParagraph);

        let infoImg = document.createElement('img');
        infoImg.src = 'assets/icons/glyphicons-196-info-sign.png';
        infoImg.width = 22;
        infoImg.height = 22;
        infoImg.style.cursor = 'pointer';
        cardHeader.appendChild(infoImg);

        let cardBody = document.createElement('div');
        cardBody.id = name + '-card-body';
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        let cardDescription = document.createElement('p');
        cardDescription.innerHTML = description;
        cardDescription.classList.add('d-none');
        cardBody.appendChild(cardDescription);

        infoImg.addEventListener('click', function() {
            if (cardDescription.classList.contains('d-none')) {
                cardDescription.classList.remove('d-none');
            } else {
                cardDescription.classList.add('d-none');
            }
        });

        let cardText = document.createElement('p');
        cardText.id = name + '-card-text';
        cardText.classList.add('card-text');
        cardText.innerText = bodyText;
        cardBody.appendChild(cardText);

        let cardAnchor = document.createElement('p');
        cardAnchor.id = name + '-card-anchor';
        cardAnchor.innerText = anchorText;
        cardAnchor.name = name;
        cardAnchor.style.cursor = 'pointer';
        cardAnchor.style.textDecoration = 'underline';

        cardAnchor.addEventListener('click', callback);
        cardAnchor.interval = null;
        cardAnchor.intervalDelay = 250;
        cardAnchor.intervalHandler = function() {
            if (cardAnchor.style.visibility === 'hidden') {
                clearInterval(cardAnchor.interval);
                cardAnchor.intervalDelay = 250;
            } else {
                cardAnchor.click();
                cardAnchor.intervalDelay = Math.max(10, cardAnchor.intervalDelay - 10);
                clearInterval(cardAnchor.interval);
                cardAnchor.interval = setInterval(cardAnchor.intervalHandler, cardAnchor.intervalDelay);
            }
        };
        cardAnchor.addEventListener('mousedown', function() {
            cardAnchor.interval = setInterval(cardAnchor.intervalHandler, cardAnchor.intervalDelay);
        });
        cardAnchor.addEventListener('mouseup', function() {
            clearInterval(cardAnchor.interval);
            cardAnchor.intervalDelay = 250;
        });
        cardAnchor.addEventListener('mouseout', function() {
            clearInterval(cardAnchor.interval);
            cardAnchor.intervalDelay = 250;
        });
        cardBody.appendChild(cardAnchor);

        let cardAnchorAll = document.createElement('p');
        cardAnchorAll.innerText = 'Buy All';
        cardAnchorAll.style.cursor = 'pointer';
        cardAnchorAll.style.textDecoration = 'underline';
        cardAnchorAll.addEventListener('click', function(){
            if (category === 'modules') {
                while (arcInc.savegame.credits >= Math.ceil(arcInc.station.modules[name].cost * Math.pow(arcInc.growth, arcInc.savegame.modules[name]))) {
                    cardAnchor.click();
                }
            }

            if (category === 'upgrades') {
                while (arcInc.savegame.credits >= Math.ceil(arcInc.objectStore.get('player').upgrades[name].cost * Math.pow(arcInc.growth, arcInc.savegame.upgrades[name]))) {
                    if (cardAnchor.style.visibility === 'hidden') {
                        this.style.visibility = 'hidden';
                        break;
                    }

                    cardAnchor.click();
                }
            }
        });
        cardBody.appendChild(cardAnchorAll);
    }
}