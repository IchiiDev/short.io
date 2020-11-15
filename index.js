const fetch = require("node-fetch");
const { LinksCollector } = require("./classes/LinksCollector");

/**
 * The main class
 * domain: Managed domain on short.io
 * api_key: API Key to access user account
 * domainId: Managed domain ID 
 */

class shortio {

    constructor(domain = String(), domainId = String(), api_key = String()) {
        if (domain == "" || api_key == "" || domainId == "") throw new Error("Invalid Class Parameters");
        this.domain = domain;
        this.api_key = api_key;
        this.domainId = domainId;
    }

    // Endpoint: GET https://api.short.io/api/links
    getLinks() {
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                headers: { accept: 'application/json', authorization: this.api_key }
            };
            fetch(`https://api.short.io/api/links?domain_id=${this.domainId}?offset=0`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject("Error: " + json.error);
                    let links = new LinksCollector(json.links, json.count);
                    resolve(links);
                });
        });
    }

    // Endpoint: GET https://api.short.io/links/expand
    getLink(path) {
        return new Promise((resolve, reject) => {
            const data = {
                method: 'GET',
                headers: { accept: 'application/json', authorization: this.api_key }
            };
            fetch(`https://api.short.io/links/expand?domain=${this.domain}&path=${path}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject("Error: " + json.error);
                    resolve(json);
                });
        });
    }

    // Endpoint: POST https://api.short.io/links
    createLink(options = Object()) {
        if (!options.originalURL) throw new Error("option.url is undefined");
        options.domain = this.domain;
        return new Promise((resolve, reject) => {
            const data = {
                method: "POST",
                headers: { accept: 'application/json', 'content-type': "application/json", authorization: this.api_key },
                body: JSON.stringify(options),
                json: true
            };
            fetch("https://api.short.io/links", data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject("Error: " + json.error);
                    resolve(json);
                });
        });
    }

    // Endpoint: POST https://api.short.io/links/bulk/
    createLinkBulk(links) {
        if (links.length < 2) throw new Error("Cannot send less than two links, please use the createLink method");
        if (links.length > 1000) throw new Error("Cannot send more than one thousand links, please split your link array");
        return new Promise((resolve, reject) => {
            const data = {
                method: "POST",
                url: "https://api.short.io/links/bulk",
                headers: { accept: 'application/json', 'content-type': "application/json", authorization: this.api_key },
                body: JSON.stringify({ domain: this.domain, links: links }),
                json: true
            };
            fetch("https://api.short.io/links/bulk", data)
                .then(response => response.json())
                .then(json => {
                    if (json.error != undefined) reject("Error: " + json.error);
                    resolve(new LinksCollector(json, json.length));
                });
        });
    }

    // Endpoint: POST https://api.short.cm/links/archive
    archiveLink(link_id) {
        return new Promise((resolve, reject) => {
            const data = {
                method: 'POST',
                headers: { 'content-type': "application/json", authorization: this.api_key },
                body: JSON.stringify({ link_id: link_id }),
                json: true
            };
            fetch("https://api.short.cm/links/archive", data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject(json.error);
                    resolve({ action: "archive", result: true });
                });
        });
    }

    // Endpoint: DELETE https://api.short.io/links/:link_id
    deleteLink(link_id) {
        return new Promise((resolve, reject) => {
            const data = {
                method: 'DELETE',
                headers: { 'content-type': "application/json", authorization: this.api_key }
            };
            fetch(`https://api.short.io/links/${link_id}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject(json.error);
                    resolve({ action: "delete", result: true });
                });
        });
    }

}

module.exports = shortio;