isDeGodText = text => {
    return text.indexOf('DeGod #') >= 0;
}

getId = text => {
    return text.split('#')[1];
}

scan = async (items, lastSize) => {
    const degodsApiUrl = "https://api.degods.dustlabs.com/degods";
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
                                pointEl.innerHTML = 'P: ' + record.degod.points;
                                e.srcElement.appendChild(pointEl);

                                const rankEl = document.createElement('div');
                                rankEl.innerHTML = 'R: ' + record.degod.rank;
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

getItems = url => {
    if (url.indexOf('degods') >= 0) {
        switch (true) {
            case url.indexOf('blur.io') >= 0:
                return document.querySelectorAll('[class*=StyledRouterLink]');
            case url.indexOf('pro.opensea.io') >= 0:
                return document.getElementsByClassName('truncate font-medium text-xs');
        }
    }

    return false;
}

isSupportedMarketplace = () => {
    const supported = [
        'blur.io',
        'pro.opensea.io'
    ];
    const url = document.location.href;

    for (const s of supported) {
        if (url.indexOf(s) >= 0) {
            return true;
        }
    }

    return false;
}

if (isSupportedMarketplace()) {
    let lastSize = 0;
    let url = document.location.href;
    setInterval(async () => {
        let items = getItems(url);
        if (items) {
            lastSize = await scan(items, lastSize);
        }
    }, 3333);
}