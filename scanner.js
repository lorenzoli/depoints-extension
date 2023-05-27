isDeGodText = text => {
    return text.indexOf('DeGod #') >= 0;
}

getId = text => {
    return text.split('#')[1];
}

scan = async (scanClassName, lastSize) => {
    const degodsApiUrl = "https://api.degods.dustlabs.com/degods";
    const items = document.querySelectorAll(scanClassName);
    const scanned = [];
    if (items != null && items.length > 0) {
        if (lastSize != items.length) {
            lastSize = items.length;

            for (let i = 0; i < items.length; i++) {
                items[i].onmouseover = async (e) => {
                    const text = e.target.innerHTML;
                    if (isDeGodText(text)) {
                        const id = getId(text);
                        if (!scanned.find(s => s === id)) {
                            scanned.push(id);
                            const res = await fetch(degodsApiUrl + '/' + id);
                            const record = await res.json();
    
                            if (record.success === true) {
                                const pointEl = document.createElement('div');
                                pointEl.innerHTML = 'Points: ' + record.degod.points;
                                e.srcElement.appendChild(pointEl);

                                const rankEl = document.createElement('div');
                                rankEl.innerHTML = 'Rank: ' + record.degod.rank;
                                e.srcElement.appendChild(rankEl);
                            }
                        }
                    }
                }
            }
        }
    }

    return lastSize;
}

isBlur = () => {
    const url = document.location.href;
    return url.indexOf('blur.io') >= 0 && url.indexOf('degods') >= 0;
}

if (isBlur()) {
    let lastSize = 0;
    let blurClassName = "[class*=StyledRouterLink]";
    setInterval(async () => {
        lastSize = await scan(blurClassName, lastSize);
    }, 3333);

}

//NftDetailsGallery
// const links = document.querySelectorAll('[class*=StyledRouterLink]');
// links.forEach(i => i.onmouseover = function(event) {
//     console.log(event.target.innerHTML)
// });
