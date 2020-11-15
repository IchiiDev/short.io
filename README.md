# short.io (NodeJS Module)
Easy to use module to interact with the short.io API, shorten links, delete them & more.
## How to use ?
Here's some exemple to kickstart your short.io integration, if you need documentation, refer to the [GitHub Repository's Wiki](https://github.com/IchiiDev/short.io/wiki).

### Basics
If you want to use your short.io account wit this package, here's some data you should get from your account:

- *domain*: The full domain redirected on the short.io service, exemple: short.domain.com.
- *domainId*: The ID of the managed domain, you can get it in the URL of the links panel, exemple: https://app.short.io/users/dashboard/**00000**/links < 00000.
- *api_key*: Your account API Key, you can manage yours here: https://app.short.io/settings/integrations/api-key/ (Only use your private key and do not publish it).

### Get a list of specific links from your domain
```js
const shortio = require("short.io");

// Create your short.io API Wrapper Instance
const short = new shortio("short.domain.com", 00000, "ZdegKTLwycVBilTxW77hY8Zq4utAn7Xk");

// This* gets a maximum of 150 links from your domain
short.getLinks().then(links => {
    console.log(links); // Print your links
});
```
**More options available on the [package's wiki page](https://github.com/IchiiDev/short.io/wiki)*
### Get a precise link from the API
```js
const shortio = require("short.io");

// Create your short.io API Wrapper Instance
const short = new shortio("short.domain.com", 00000, "ZdegKTLwycVBilTxW77hY8Zq4utAn7Xk");

// This gets a precise link informations, the 00000 is the link ID.
short.getLink(00000).then(link => {
    console.log(link);
});
```
### Push a link to your shortner domain
```js
const shortio = require("short.io");

// Create your short.io API Wrapper Instance
const short = new shortio("short.domain.com", 00000, "ZdegKTLwycVBilTxW77hY8Zq4utAn7Xk");

// This* creates a link on your short.io service.
short.createLink({ originalURL: "https://discord.gg/fr" }).then(link => {
    console.log(link);
});
```
**More options available on the [package's wiki page](https://github.com/IchiiDev/short.io/wiki)*
### Deletes a link from your shortner domain
```js
const shortio = require("short.io");

// Create your short.io API Wrapper Instance
const short = new shortio("short.domain.com", 00000, "ZdegKTLwycVBilTxW77hY8Zq4utAn7Xk");

// This deletes a link, the 00000 is the link ID.
short.deleteLink(00000) // Delete the link
    .then(result => console.log(result)) // Display the result for debug
    .catch(e => console.log(e)); // Catch error if one occures
```
## How to contribute ?
Feel free to fork my work and propose changes. If you have any issues with my work, please [open an Issue](https://github.com/IchiiDev/short.io/issues).

## Contributors
- [@IchiiDev](https://github.com/IchiiDev): `ichii@discord.fr` (Contact E-Mail).


## What's new ?
### `v1.1.O`: Security update
- Changed request dependency package from [`request`](https://npmjs.com/package/request) to [`node-fetch`](https://npmjs.com/package/node-fetch) (`request` was deprecated).
- Added promises to the `deleteLink()` and `archiveLink()` function.

## What's coming ?
- [ ] New API endpoints handling and functions
- [ ] Add more classes to improve package ergonomics 
- [ ] Improve bulk functions

<br/><br/>
<p align="center"><strong><i>IchiiDev/short.io is not affiliated to the website and enterprise <a href="" target="_blank">short.io</a>.</i></strong></p>
