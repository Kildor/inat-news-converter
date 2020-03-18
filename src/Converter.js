import DataType from './DataType.js';
import MarkdownIt from 'markdown-it';
import MarkdownAttr from 'markdown-it-attrs';

class Item {
	#count = 0;
	title = [];
	removeDelimeters = false;
	constructor(removeDelimeters) {
		this.removeDelimeters = removeDelimeters;
	}
	get count() {
		if (!this.removeDelimeters) return this.#count;
		return this.#count.replace(/[\D]/g,'');
	}
	set count(value) {
		this.#count = value;
	}
}
class Converter {
	lastConvertedType = DataType.UNKNOWN;
	#settings = { showHeader: true, latinFirst: false, useMarkdown: false, removeDelimeters: false, addUserlink: true};

	markdown = function () { const md = new MarkdownIt({ html: true, breaks: true});
		md.use(MarkdownAttr);
		console.dir(md);
		return md;
		}();

	constructor(settings) {
		this.#settings = Object.assign(this.#settings,settings);

	}

	newItem() {
		return new Item(this.#settings.removeDelimeters);
	}

	checkType(text) {
			let firstLine = text.substr(0, text.indexOf('\n')).trim();
			if (firstLine.indexOf('\'') === 0 ) return DataType.Text;
			else if (/^(.+)\t(.+)\t(.+)\t(.+)$/.test(firstLine))
				return DataType.Observers;
			else if (/^(.+)\t(.+)\t(.+)$/.test(firstLine))
				return DataType.Experts;
			else if (/^\s*[\d ,]+\s*$/.test(firstLine))
				return DataType.Subprojects;
			else if (/^\s*[\d ,]+\s.+$/.test(firstLine))
				return DataType.Species;
			else
				return DataType.Text;
		};

		writeTableHeader(fields) {
			if (!this.#settings.showHeader) return '';
			return `<thead><tr><th>${fields.join('</th><th>')}</th></tr></thead>`;
		}
		convertSubProjects = (text) => {
			let converted = '';
			let items = [];
			let item = null;
			const regexpCount = /^[0-9 ,.]+$/;
			text.split('\n').forEach(line => {
				line = line.trim();
				if (regexpCount.test(line)) {
					if (item != null) items.push(item);
					item = this.newItem();
					item.count = line;
				}
				else if (item !== null)
					item.title.push(line);
			});
			if (item !== null) items.push(item);

			if (items.length > 0) {
				converted += this.writeTableHeader(['Проект', 'Количество']);
				items.forEach(item => converted += `<tr><td>${item.title[0]}</td><td>${item.count}</td></tr>\n`);
				}
			return converted;
		}
		convertSpecies = (text) => {
			let converted = '';
			let items = [];
			let item = null;
			const regexpCount = /^[A-Z]*([0-9]+)\s.+$/;
			text.split('\n').forEach(line => {
				line = line.trim();
				let match = line.match(regexpCount);
				if (!!match) {
					if (item != null) items.push(item);
					item = this.newItem();
					item.count = match[1];
				}
				else if (item !==null)
					item.title.push(line);
			});
			if (item!==null) items.push(item);

			if (items.length > 0) {
				converted += this.writeTableHeader(['Вид', 'Количество наблюдений']);

				items.forEach(item => {
					let title = '';
					if (item.title.length === 1) {
						title = `<em>${item.title[0]}</em>`;
					} else if(item.title.length > 0) {
						if (item.title[0].length <3) { //CC
							item.title.shift();
						}
						if (this.#settings.latinFirst) {
							title = `${item.title[1]} <em>(${item.title[0]})</em>`;
						} else {
							title = `${item.title[0]} <em>(${item.title[1]})</em>`;
						}
					}
					converted += `<tr><td>${title}</td><td>${item.count}</td></tr>\n`}
					);
				}
			return converted;
		}
		convertExperts(text) {
			let converted = '';
			const regexp = /^(.+)\t(.+)\t(.+)$/;
			converted += this.writeTableHeader(['Место', 'Эксперт', 'Идентификаций']);
			text.split('\n').forEach(line => {
				if (/^\D+\t/.test(line)) return;
				let item = this.newItem();
				let match = line.match(regexp);
				if (!!match) {
					item.count = match[3];
					item.title.push(match[1].trim());
					item.title.push(match[2].trim());
					converted += `<tr><td>${item.title[0]}</td><td>${this.#settings.addUserlink ? '@' : ''}${item.title[1]}</td><td>${item.count}</td></tr>\n`;
				}
			});
			return converted;
		}

		convertObservers(text) {
			let converted = '';
			const regexp = /^(.+)\t(.+)\t(.+)\t(.+)$/;
			converted += this.writeTableHeader(['Место', 'Наблюдатель', 'Наблюдений','Видов']);
			text.split('\n').forEach(line => {
				if (/^\D+\t/.test(line)) return;
				let itemObservations = this.newItem();
				let itemSpecies = this.newItem();
				let match = line.match(regexp);
				if (!!match) {
					itemObservations.count = match[3];
					itemSpecies.count = match[4];
					itemObservations.title.push(match[1].trim());
					itemObservations.title.push(match[2].trim());
					converted += `<tr><td>${itemObservations.title[0]}</td><td>${this.#settings.addUserlink ? '@' : ''}${itemObservations.title[1]}</td><td>${itemObservations.count}</td><td>${itemSpecies.count}</td></tr>\n`;
				}
			});
			return converted;
		}

	convertText(text) {
		let converted = '';
		if (text.indexOf('\'') === 0) text = text.substr(1, text.length).trim();
		if (text.length === 0) return '';
		if (this.#settings.useMarkdown) {
			// console.dir(this.markdown);
			converted = this.markdown.render(text);
		} else {
			converted = '<p>' + text + '</p>'
		}
		// converted = converted.split('\n').join('<br/>\n');
		return converted + '\n';
	}
		convert = (text) => {
			let converted = '';
			text = text.trim();
			if (text.length === 0) {
				this.lastConvertedType = DataType.UNKNOWN;
				return '';
			}

			let convertedType = -1;
			text.split(/(?:\r?\n){2,}/).forEach(block => {
				// if (text.contains())
				this.lastConvertedType = this.checkType(block);

				if (convertedType > 0 && convertedType!== this.lastConvertedType) convertedType = DataType.Mix;
				else convertedType = this.lastConvertedType;

				if (this.lastConvertedType !== DataType.Text) converted += "<table class='table table-striped table-hover table-condensed'>\n";
				switch (this.lastConvertedType) {
					case DataType.Text:
						converted += this.convertText(block);
						break;
					case DataType.Observers:
						converted += this.convertObservers(block);
						break;
					case DataType.Experts:
						converted += this.convertExperts(block);
						break;
					case DataType.Subprojects:
						converted += this.convertSubProjects(block);
						break;
					case DataType.Species:
						converted += this.convertSpecies(block);
						break;
					case DataType.UNKNOWN:
					default:
						converted += '<tr><td>Неизвестный вариант</td></tr/>';
						break;
				}
				if (this.lastConvertedType !== DataType.Text) converted += '</table>\n';
			});
			this.lastConvertedType = convertedType;
		converted.replace(/(\/t[dh]>)(<t[dh])/g, '$1 $2');
		return converted;
		};

		updateSettings(newSettings) {
			this.#settings = Object.assign(this.#settings, newSettings);
		}
}

export default Converter;
