const request = require("request");

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
    getLinks(options) {
        return new Promise((resolve, reject) => {
            let links = new Object();
            if (typeof options != "object") throw new Error(`${options} are not valid options`);
            if (options.offset == undefined) throw new Error("Invalid request parameters");
            options.domain_id = this.domain;
            const data = { method: "GET", url: "https://api.short.cm/api/links", qs: options, headers: { accept: 'application/json', authorization: this.api_key } };
            request(data, (error, response, body) => {
                if (error) throw new Error(error);
                console.log(body);
            });
        });
    }

}

module.exports = shortio;