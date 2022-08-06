## About

[Neutralino.js](https://neutralino.js.org/docs/) multi-window support for [Svelte](https://svelte.dev/).

> Interaction with windows is built on [Neutralino.js storages](https://neutralino.js.org/docs/api/storage). All windows use the main index.html, but each window does not contain other windows.

## Installation

Using npm|yarn:

```bash
$ npm i --save njsmws
$ yarn add njsmws
```

In **neutralino.config.json**:<br>
- Add new permissions to the config:
```json
"nativeAllowList": [
	"window.*", 
	"storage.*"
]
```
- At the moment, the token security is supported - "sessionStorage" or "none":
```json
"tokenSecurity": "sessionStorage"
```


In **main.js/main.ts**:

```javascript
import {WindowsManager} from 'njsmws'

/* The main component that starts first. */
import App from './App.svelte'
import Secondary from './windows/Secondary.svelte'

/* HTML id that the DIV will have. */
const componentId = 'app';

/* Creating a new class, starts the 
 * window you specified as the main one. 
 * You can add other windows at any time. 
 */
const wm = new WindowsManager(App, componentId);

/* Adding a window. */
/* HTML identifier that will have a DIV and a storage. */
const componentWindowId = 'window-2';

/* The second argument is the Svelte component. 
 * To make it simple to understand, the component 
 * will be the content of the window and its 
 * visibility will be limited to the window. 
 */
wm.create(componentWindowId, Secondary, {
	/* Next are the standard window options, 
	 * which can be found at:
	 * https://neutralino.js.org/docs/api/window#return-object-awaited 
	 */
	icon: '/public/icons/appIcon.png',
	enableInspector: true,
	width: 600,
	height: 400,
	maximizable: false,
	exitProcessOnClose: true,
	/* Most likely the arguments will not work, 
	 * even if you create a new window, 
	 * the index.html of the main window is used 
	 * (maybe this will be fixed). 
	 */
	processArgs: '',
	title: 'Window'
});
```
