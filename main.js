const Apify = require('apify');
const httpRequest = require('@apify/http-request');

Apify.main(async () => {
    const input = await Apify.getInput();
    const { defaultDatasetId } = input.resource;
    const url = `https://api.apify.com/v2/datasets/${defaultDatasetId}/items`;
    const { body } = await httpRequest({ url, json: true });
    const { items } = body[0];
    const map = new Map();

    items.forEach((item) => {
        const key = item.itemUrl;
        if (map.has(key)) {
            const { offer } = map.get(key);
            if (Number(item.offer.substr(1)) < Number(offer.substr(1))) {
                map.set(key, item);
            }
        } else {
            map.set(key, item);
        }
    });

    const filtered = [];
    map.forEach((value) => {
        filtered.push(value);
    });

    await Apify.pushData({
        items: filtered,
    });
});
