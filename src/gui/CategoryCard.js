class CategoryCard {
    static prepare(parent, name, headerText) {
        let toggleCategoryFunction = function(event) {
            let image = event.target;
            let card = event.target.parentElement.parentElement;
            let cardBody = card.children[1];

            let imageSrc = image.src;
            image.src = image.altSrc;
            image.altSrc = imageSrc;
            if (cardBody.classList.contains('d-none')) {
                cardBody.classList.remove('d-none');
            } else {
                cardBody.classList.add('d-none');
            }
        };

        let card = document.createElement('div');
        card.id = name + '-category-card';
        card.classList.add('card', 'bg-space-cadet');
        parent.appendChild(card);

        let cardHeader = document.createElement('div');
        cardHeader.id = name + '-category-card-header';
        cardHeader.classList.add('card-header', 'bg-space-cadet', 'd-flex', 'justify-content-between');
        card.appendChild(cardHeader);

        let cardHeaderParagraph = document.createElement('h5');
        cardHeaderParagraph.innerText = headerText;
        cardHeader.appendChild(cardHeaderParagraph);

        let resizeImg = document.createElement('img');
        resizeImg.src = 'assets/icons/glyphicons-215-resize-small.png';
        resizeImg.altSrc = 'assets/icons/glyphicons-216-resize-full.png';
        resizeImg.width = 16;
        resizeImg.height = 16;
        resizeImg.style.cursor = 'pointer';
        resizeImg.addEventListener('click', toggleCategoryFunction);
        cardHeader.appendChild(resizeImg);

        let cardBody = document.createElement('div');
        cardBody.id = name + '-category-card-body';
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        return cardBody;
    }
}