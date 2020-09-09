const request = require("request");
const { LinksCollector } = require("./classes/LinksCollector");

/**
 * The main class
 * domain: Managed domain on short.io
 * api_key: API Key to access user account
 */

class shortio {

    constructor(domain = String(), api_key = String()) {
        if (domain == "" || api_key == "") throw new Error("Invalid Class Parameters");
        this.domain = domain;
        this.api_key = api_key;
    }

    // Endpoint: https://api.short.cm/api/links
    getLinks() {
        return new Promise((resolve, reject) => {
            const data = { method: "GET", url: `https://api.short.cm/api/links?domain_id=${this.domain}?offset=0`, headers: { accept: 'application/json', authorization: this.api_key } };
            request(data, (error, response, body) => {
                if (error) throw new Error(error);
                let links = new LinksCollector(JSON.parse(body));
                resolve(links);
            });
        });
    }

}

module.exports = shortio;