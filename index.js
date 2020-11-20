const fetch = require("node-fetch");
const { LinksCollector } = require("./classes/LinksCollector");

class shortio {

    /**
     * This is the main class of the package, it holds every functions.
     * @param {String} domain [required] Managed domain on short.io
     * @param {number} domainId [required] API Key to access user account
     * @param {String} api_key [required] Managed domain ID
     */
    constructor(domain = "", domainId = 0, api_key = "") {
        if (domain == "" || api_key == "" || domainId == 0) throw new Error("Invalid Class Parameters");
        this.domain = domain;
        this.api_key = api_key;
        this.domainId = domainId;
    }

    /** 
     * This functions gets a list of 150 (API Max) links from a single domain. Endpoint: GET https://api.short.io/api/links
     * @param {number} limit Number of links returned by the API search. (Max 150)
     * @param {String} tag Tag to filter in the links list
     * @param {number} offset Link offset (Default: 0) 
     * @returns {Promise<LinksCollector>} Links collection object returned by the API
     */
    getLinks(limit = 150, tag = "", offset = 0) {
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                headers: { accept: 'application/json', authorization: this.api_key }
            };
            fetch(`https://api.short.io/api/links?domain_id=${this.domainId}&offset=${offset}&limit=${limit}${(tag != "") ? "&tag=" + tag : ""}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject("Error: " + json.error);
                    let links = new LinksCollector(json.links, json.count);
                    resolve(links);
                });
        });
    }

    // Endpoint: GET https://api.short.io/links/expand
    /**
     * This functions gets a link object (filtered by the link path). Endpoint: GET https://api.short.io/links/expand
     * @param {String} path [required] Link's path
     * @returns {Object} Link JSON Object returned by the API
     */
    getLink(path = "") {
        if (path == "") throw new Error("path is undefined")
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