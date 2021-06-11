# short.io (NodeJS Module)
Easy to use module, made to interact with the short.io API, shorten links, delete them & more.

[![DeepScan grade](https://deepscan.io/api/teams/10968/projects/14758/branches/281944/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10968&pid=14758&bid=281944)
[![DeepSource](https://deepsource.io/gh/IchiiDev/short.io.svg/?label=active+issues&show_trend=true)](https://deepsource.io/gh/IchiiDev/short.io/?ref=repository-badge)

## How to use short.io ?
Here's some exemple to kickstart your short.io integration, if you need documentation, refer to the [GitHub Repository's Wiki](https://github.com/IchiiDev/short.io/wiki). ⚠️ *Outdated, a custom documentation website will come.*

**IchiiDev/short.io is not affiliated to the website and enterprise [short.io](https://short.io)**

### Basics
If you want to use your short.io account with this package, here's some data you should get from your account:

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
### Delete a link from your shortner domain
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
- [@IchiiDev](https://github.com/IchiiDev): `contact@ichiidev.xyz` (Contact E-Mail).


## What's new ?
### `v1.1.O`: Security update
- Changed request dependency package from [`request`](https://npmjs.com/package/request) to [`node-fetch`](https://npmjs.com/package/node-fetch) (`request` was deprecated).
- Added promises to the `deleteLink()` and `archiveLink()` function.
### `v1.1.1`: Documentation Update
- Fixed the `getLinks()` function, added more parameters like `offset`, `tag` and `limit`.
- Added more documentation to the code
### `v1.2.0`: Link Management Update
- Added the `updateLink()` function to permit link edition
- Added the `getByOriginalURL()` function to get a link object by querying it's originalURL.
- Removed useless functions parameters
- Corrected JS Doc errors
### `v1.3.0`: Statistics 🥳
- Added domain, clicks and links stats methods
- Fixed some code execution errors 
- Removed useless constants from the code
## What's coming ?
- [ ] Add more classes to improve package ergonomics => V2 (TypeScript)
- [ ] Global rewrite of the package in TS to improve documentation and code quality + user ergonomic => V2

V2 will come directly as the next update, there wont be any 1.4.0 for domain management (Theses methods will be added along with the V2)

<br/><br/>
<p align="center"><strong><i>IchiiDev/short.io is not affiliated to the website and enterprise <a href="" target="_blank">short.io</a>.</i></strong></p>
