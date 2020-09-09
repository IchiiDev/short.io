class LinksCollector {

    constructor(api_response) {
        this.count = api_response.count;
        this.links = api_response.links;
    }

    get(link_id) {
        for (let i = 0; i < this.links.length; i++) {
            if (!(this.links[i].id == link_id || this.links[i].id == link_id)) continue;
            return this.links[i];
        }
        throw new Error("Can't find " + link_id + " into the links list.");
    }

}

module.exports = { LinksCollector };