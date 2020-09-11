const request = require("request");
const { LinksCollector } = require("./classes/LinksCollector");

/**
 * The main class
 * domain: Managed domain on short.io
 * api_key: API Key to access user account
 */

class shortio {

    constructor(domain = String(), domainId = String(), api_key = String()) {
        if (domain == "" || api_key == "") throw new Error("Invalid Class Parameters");
        this.domain = domain;
        this.api_key = api_key;
        this.domainId = domainId;
    }

    // Endpoint: GET https://api.short.io/api/links
    getLinks() {
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                url: `https://api.short.io/api/links?domain_id=${this.domainId}?offset=0`,
                headers: { accept: 'application/json', authorization: this.api_key }
            };
            request(data, (error, response, body) => {
                if (error) throw error;
                if (body.error) throw new Error(body.error);
                let links = new LinksCollector(JSON.parse(body).links, JSON.parse(body).count);
                resolve(links);
            });
        });
    }

    // Endpoint: GET https://api.short.io/links/expand
    getLink(path) {
        return new Promise((resolve, reject) => {
            const data = {
                method: 'GET',
                url: `https://api.short.io/links/expand?domain=${this.domain}&path=${path}`,
                headers: { accept: 'application/json', authorization: this.api_key }
            };
            request(data, (error, response, body) => {
                if (error) throw error;
                if (body.error) throw new Error(body.error);
                resolve(JSON.parse(body));
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
                url: "https://api.short.io/links",
                headers: { accept: 'application/json', 'content-type': 'application/json', authorization: this.api_key },
                body: options,
                json: true
            };
            request(data, (error, response, body) => {
                if (error) throw error;
                if (body.error) throw new Error(body.error);
                resolve(body);
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
                headers: { accept: 'application/json', 'content-type': 'application/json', authorization: this.api_key },
                body: { domain: this.domain, links: links },
                json: true
            };
            request(data, (error, response, body) => {
                if (error) throw error;
                if (body[0].error) throw new Error(body.error);
                resolve(new LinksCollector(body, body.length));
            });
        });
    }

    // Endpoint: POST https://api.short.cm/links/archive
    archiveLink(link_id) {
        const data = {
            method: 'POST',
            url: 'https://api.short.cm/links/archive',
            headers: { 'content-type': 'application/json', authorization: this.api_key },
            body: { link_id: link_id },
            json: true
        };
        request(data, (error, response, body) => {
            if (error) throw error;
            if (body.error) throw new Error(body.error);
        });
    }

    // Endpoint: DELETE https://api.short.io/links/:link_id
    deleteLink(link_id) {
        const data = {
            method: 'DELETE',
            url: `https://api.short.io/links/${link_id}`,
            headers: { 'content-type': 'application/json', authorization: this.api_key }
        };
        request(data, (error, response, body) => {
            if (error) throw error;
            if (body.error) throw new Error(body.error);
        });
    }

}

module.exports = shortio;