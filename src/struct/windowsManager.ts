import {ERROR} from '../enum/error';

export class WindowsManagerError extends Error {
	constructor(msg: string) {
		super(msg);
		Object.setPrototypeOf(this, WindowsManagerError.prototype);
	}
}

export class WindowsManager {
	/**
	 * It creates a new instance of the component and renders it to the DOM.
	 * @param {any} component - The component to be rendered.
	 * @param {string} id - The id of the div element that will be used to render the component.
	 */
	constructor(public component: any, public id: string) {
		this.component = new component({
			target: document.getElementById(id)
		});
	}

	/**
	 * If the user has already logged in, then recreate the window, else reset the window and recreate itю
	 * @param {string} id - The id of the window.
	 * @param {any} component - The component to be rendered.
	 * @param options - {}
	 */
	create(id: string, component: any, options: {}) {
		Neutralino.app.getConfig().then((cfg) => {
			if (cfg?.['tokenSecurity'] !== 'sessionStorage' && cfg?.['tokenSecurity'] !== 'none') {
				console.error(new WindowsManagerError(ERROR.TOKEN.replace('${var}', cfg?.['tokenSecurity'])));
			} else {
				Neutralino.storage.getData(id).then((content: string) => {
					if (JSON.parse(content)?.['token'] === NL_TOKEN) {
						this.recreate(id, component, options).catch((e) => console.error(e));
					} else {
						this.reset(id).then(() => this.recreate(id, component, options));
					}
				}).catch(() => {
					this.reset(id).then(() => this.recreate(id, component, options));
				});
			}
		});
	}

	/**
	 * It resets the data.
	 * @param {string} id - The id of the file to be created.
	 */
	private async reset(id: string) {
		await Neutralino.storage.setData(id, JSON.stringify({
			token: String(NL_TOKEN),
			opened: false
		}));
	}

	/* A function that creates a new window. */
	private async recreate(id: string, component: any, options: {}) {
		const content: Window = JSON.parse(await Neutralino.storage.getData(id));

		if (!content?.['opened']) {
			await Neutralino.window.create(`/index.html#${id}`, options);
			content['opened'] = true;
			await Neutralino.storage.setData(id, JSON.stringify(content));
		} else if (location.hash === `#${id}`) {
			document.getElementById('app')?.remove();

			if (!document.getElementById(id)) {
				const div = document.createElement('div');
				div['id'] = id;
				document.body.append(div);

				await new component({
					target: document.getElementById(id)
				});
			}
		}
	};
}
