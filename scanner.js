isDeGodText = text => {
    return text.indexOf('DeGod #') >= 0;
}

isY00tsText = text => {
    return text.indexOf('y00t #') >= 0;
}

getId = text => {
    return text.split('#')[1];
}

scanDegods = async (items, lastSize) => {
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

scanY00ts = async (items, lastSize) => {
    const y00tsApiUrl = "https://api.y00ts.com/y00ts";
    const scanned = [];
    if (items != null && items.length > 0) {
        if (lastSize != items.length) {
            lastSize = items.length;

            for (let i = 0; i < items.length; i++) {
                items[i].onmouseover = async (e) => {
                    const text = e.target.innerHTML;
                    if (isY00tsText(text)) {
                        const id = getId(text);
                        if (!scanned.find(s => s === id)) {
                            scanned.push(id);
                            const res = await fetch(y00tsApiUrl + '/' + id);
                            const record = await res.json();
    
                            if (record.success === true) {
                                const pointEl = document.createElement('div');
                                pointEl.innerHTML = 'P: ' + record.y00t.points;
                                e.srcElement.appendChild(pointEl);
                            }
                        }
                    }
                }
            }
        }
    }

    return lastSize;
}

getDeGods = () => {
    let url = document.location.href;
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

getY00ts = () => {
    let url = document.location.href;
    if (url.indexOf('y00ts') >= 0) {
        switch (true) {
            case url.indexOf('opensea.io') >= 0:
                return document.getElementsByClassName('sc-29427738-0 sc-9c231a46-2 kpwlUS eaBdYG');
        }
    }

    return false;
}

isSupportedMarketplace = supported => {
    const url = document.location.href;

    for (const s of supported) {
        if (url.indexOf(s) >= 0) {
            return true;
        }
    }

    return false;
}

if (isSupportedMarketplace(['blur.io', 'pro.opensea.io'])) {
    let lastSize = 0;
    setInterval(async () => {
        let items = getDeGods();
        if (items) {
            lastSize = await scanDegods(items, lastSize);
        }
    }, 333);
}

if (isSupportedMarketplace(['opensea.io'])) {
    let lastSize = 0;
    let url = document.location.href;
    setInterval(async () => {
        let items = getY00ts();
        if (items) {
            lastSize = await scanY00ts(items, lastSize);
        }
    }, 333);
}