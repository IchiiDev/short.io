const fetch = require("node-fetch");
const { LinksCollector } = require("./classes/LinksCollector");

class shortio {

    /**
     * This is the main class of the package, it holds every functions.
     * @param {String} domain [required] Managed domain on short.io
     * @param {number} domainId [required] API Key to access user account
     * @param {String} api_key [required] Managed domain ID
     */
    constructor(domain, domainId, api_key) {
        this.domain = domain;
        this.api_key = api_key;
        this.domainId = domainId;
    }

    /** 
     * This function gets a list of 150 (API Max) links from a single domain. Endpoint: GET https://api.short.io/api/links
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

    /**
     * This function gets a link object from the specified domain (filtered by the link path). Endpoint: GET https://api.short.io/links/expand
     * @param {String} path [required] Link's path
     * @returns {Promise<Object>} Link JSON Object returned by the API
     */
    getLink(path) {
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

    /**
     * This function gets a link by searching by it's originalURL. Endpoint: GET https://api.short.io/links/by-original-url
     * @param {string} originalURL [required] The originalURL of the queried link
     * @returns {Promise<Object>} The link object behind the queried originalURL
     */
    getByOriginalURL(originalURL) {
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                headers: { accept: 'application/json', 'content-type': "application/json", authorization: this.api_key },
            };
            fetch(`https://api.short.io/links/by-original-url?domain=${this.domain}&originalURL=${originalURL}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error != undefined) reject("Error: " + json.error);
                    resolve(json);
                });
        });
    }

    /**
     * This function create a link on the specified domain and returns a link object. Endpoint: POST https://api.short.io/links
     * @param {Object} options [required] The link object to create on the specified domain. option.originalURL is mendatory.
     * @returns {Promise<Object>} Created Link's JSON object returned by the API
     */
    createLink(options) {
        if (!options.originalURL) throw new Error("option.originalURL is undefined");
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

    /**
     * This function create up to 1000 different links and returns a LinksCollector Object. Endpoint: POST https://api.short.io/links/bulk
     * @param {Object[]} links [required] Array of Links Objects. In each Object, the Object.originalURL must be defined. 
     * @returns {Promise<LinksCollector>} LinksCollector Object returned by the API call.
     */
    createLinkBulk(links) {
        if (links.length < 2) throw new Error("Cannot send less than two links, please use the createLink method");
        if (links.length > 1000) throw new Error("Cannot send more than one thousand links, please split your link array");
        return new Promise((resolve, reject) => {
            const data = {
                method: "POST",
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

    /**
     * This function updates a link from the specified domain to change it's params. Endpoint: POST https://api.short.io/links/:link_id
     * @param {number} id This is the ID of the link you want to update.
     * @param {Object} linkObject This is the new link object of the updated link.
     * @returns {Promise<Object>} Updated link's object returned by the API.
     */
    updateLink(id, linkObject) {
        if (!linkObject.originalURL) throw new Error("originalURL is not defined");
        linkObject.domain = this.domain;
        return new Promise((resolve, reject) => {
            const data = {
                method: "POST",
                headers: { accept: 'application/json', 'content-type': "application/json", authorization: this.api_key },
                body: JSON.stringify(linkObject),
                json: true
            };
            fetch(`https://api.short.cm/links/${id}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error != undefined) reject("Error: " + json.error);
                    resolve(json);
                });
        });
    }

    /**
     * This function archive a link from the specified domain. Endpoint: POST https://api.short.cm/links/archive
     * @param {number} link_id The ID of the link you want to archive.
     * @returns {Promise<Object>} Request response object into a promise.
     */
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

    /**
     * This function deletes a link from the specified domain. Endpoint: DELETE https://api.short.cm/links/:link_id
     * @param {number} link_id The ID of the link you want to delete.
     * @returns {Promise<Object>} Request response object into a promise.
     */
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

    /**
     * This functions calls the registered domain's stats. GET https://api-v2.short.cm/statistics/domain/:domainId
     * @param {string} period The observed period for the stats.
     * @param {number} tzOffset The difference between your timezone & the GMT timezone. 
     * @returns {Object} The selected domain's stats returned by the API.
     */
    getDomainStats(period = "", tzOffset = 0) {
        if (["today", "yesterday", "week", "month", "lastmonth", "last7", "last30", "total"].indexOf(period) < 0) throw new Error("The period is either invalid or undefined");
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                headers: { 'content-type': "application/json", authorization: this.api_key }
            }
            fetch(`https://api-v2.short.cm/statistics/domain/${this.domainId}?period=${period}&tzOffset=${tzOffset}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject(json.error);
                    resolve(json);
                });
        });
    }

    /**
     * This function gets the clicks stats for the requested IDs. GET https://api-v2.short.cm/statistics/domain/:domainID/link_clicks
     * @param {Array<number>} ids All the IDs you want to get the stats for
     * @returns {Promise<Object>} The JSON object corresponding to the stats of the requested IDs. Format: { ID: value, ... }
     */
    getLinksClicks(ids) {
        if (ids.length < 1) throw new Error("The provided IDs are not in an Array format");
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                headers: { Authorization: this.api_key }
            }
            fetch(`https://api-v2.short.cm/statistics/domain/${this.domainId}/link_clicks?ids=${ids.join(",")}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject(error);
                    resolve(json);
                });
        });
    }

    getPopularPaths(period, offset = 0) {
        if (["today", "yesterday", "week", "month", "lastmonth", "last7", "last30", "total"].indexOf(period) < 0) throw new Error("The period is either invalid or undefined");
        return new Promise((resolve, reject) => {
            const data = {
                method: "GET",
                headers: { Authorization: this.api_key }
            }
            fetch(`https://api-v2.short.cm/statistics/domain/${this.domainId}/paths?period=${period}&tzOffset=${offset}`, data)
                .then(response => response.json())
                .then(json => {
                    if (json.error) reject(error);
                    resolve(json);
                });
        });
    }

}

module.exports = shortio;