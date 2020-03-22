import DataType from './DataType.js';
import MarkdownIt from 'markdown-it';
import MarkdownAttr from 'markdown-it-attrs';
import defaultPreferences from './preferences.json';

class Item {
	#count = [];
	title = [];
	removeDelimeters = false;
	constructor(removeDelimeters) {
		this.removeDelimeters = removeDelimeters;
	}
	get count() {
		if (this.#count.length === 0) this.#count.push(0);
		if (!this.removeDelimeters) return this.#count;
		return this.#count.map(count => count.replace(/[\D]/g, ''));
	}
	set count(value) {
		if (typeof value === 'string') this.#count.push(value);
		else this.#count = value ;
	}
	
	setCount(index, value) {
		this.#count[index]=value;
	}


}

class Converter {
	lastConvertedType = DataType.UNKNOWN;
	#settings = function() {
		let prefs = {};
		defaultPreferences.forEach(element => {
			prefs[element.name]=element.default
		});
		return prefs;
	}();

	markdown = function () { const md = new MarkdownIt({ html: true, breaks: true});
		md.use(MarkdownAttr);
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

			if (firstLine.indexOf('\'') === 0)
				return DataType.Text;
			else if (/^!\(\s*([1-4]\s*)/.test(firstLine)) // !(type [!! colname !! colname ...])
				return parseInt(firstLine.match(/^!\(([1-4])/)[1]);
			else if (/^(.+)\t(.+)\t(.+)\t(.+)$/.test(firstLine))
				return DataType.Observers;
			else if (/^(.+)\t(.+)\t(.+)$/.test(firstLine))
				return DataType.Experts;
			else if (/^\s*[\d ,]+\s*$/.test(firstLine))
				return DataType.Subprojects;
			else if (/^\s*[A-Z]?[\d ,]+\s.+$/.test(firstLine))
				return DataType.Species;
			else
				return DataType.Text;
		};

		writeTableHeader(text) {
			if (this.#settings.showHeader) {
				let firstLine = text.substr(0, text.indexOf('\n')).trim();
				let match = firstLine.match(/^!\(\d\s*!!(.+)(?=!!)?\)$/);

				let names = [];

				if (match) {
					names = match[1].trim().split(/\s*!!\s*/)
				} else {
					names = this.takeDefaultNames();
				}
				if (names.length > 0) return `<thead><tr><th>${names.join('</th><th>')}</th></tr></thead>`;
			}
			return '';
		
		}
	takeDefaultNames() {
		switch(this.lastConvertedType) {
			case DataType.Species:
				var names = ['Позиция','Вид', 'Количество наблюдений'];
				break;
			case DataType.Subprojects:
				names = ['Позиция', 'Проект', 'Количество'];
				break;
			case DataType.Experts:
				names = ['Место', 'Эксперт', 'Идентификаций'];
				break;
			case DataType.Observers:
				names = ['Место', 'Наблюдатель', 'Наблюдений', 'Видов'];
				break;
			default:
				return [];
			}
			if (!this.#settings.addCounter) names.shift();
			return names;
	}
		convertSubProjects = (text) => {
			let converted = '';
			let items = [];
			let item = null;
			let position = 1;
			const regexpCount = /^[0-9 ,.]+$/;
			text.split('\n').forEach(line => {
				line = line.trim();
				if (regexpCount.test(line)) {
					if (item != null) items.push(item);
					item = this.newItem();
					item.count = line;
				}
				else if (item !== null) {
					item.title.push(line);
					item.title.push(position++);

				}
			});
			if (item !== null) items.push(item);

			if (items.length > 0) {
				items.forEach(item => converted += `<tr>${this.#settings.addCounter ? '<td>'+item.title[1]+'</td>':''}<td>${item.title[0]}</td><td>${item.count[0]}</td></tr>\n`);
				}
			return converted;
		}

		convertSpecies = (text) => {
			let converted = '';
			let items = [];
			let item = null;
			let position = 1;
			const regexpCount = /^[A-Z]*([0-9 ,.]+)\s.+$/;

			text.split('\n').forEach(line => {
				line = line.trim();
				let match = line.match(regexpCount);
				if (!!match) {
					if (item != null) {
						item.title.push(position++);
						items.push(item);
					}
					item = this.newItem();
					item.count = match[1];
				}
				else if (item !==null)
					item.title.push(line);
			});
			if (item!==null) {
				item.title.push(position++);
				items.push(item);
			}

			if (items.length > 0) {
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
					converted += `<tr>${this.#settings.addCounter ? '<td>' + item.title[2] + '</td>' : ''}<td>${title}</td><td>${item.count[0]}</td></tr>\n`}
					);
				}
			return converted;
		}
		convertExperts(text) {
			let converted = '';
			const regexp = /^(.+)\t(.+)\t(.+)$/;
			text.split('\n').forEach(line => {
				if (/^\D+\t/.test(line)) return;
				let item = this.newItem();
				let match = line.match(regexp);
				if (!!match) {
					item.count = match[3];
					item.title.push(match[1].trim());
					item.title.push(match[2].trim());
					converted += `<tr>${this.#settings.addCounter ? `<td>${item.title[0]}</td>` : ''}<td>${this.#settings.addUserlink ? '@' : ''}${item.title[1]}</td><td>${item.count[0]}</td></tr>\n`;
				}
			});
			return converted;
		}

		convertObservers(text) {
			let converted = '';
			const regexp = /^(.+)\t(.+)\t(.+)\t(.+)$/;
			text.split('\n').forEach(line => {
				if (/^\D+\t/.test(line)) return;
				let item = this.newItem();
				let match = line.match(regexp);
				if (!!match) {
					item.count = match[3];
					item.count = match[4];
					item.title.push(match[1].trim());
					item.title.push(match[2].trim());
					converted += `<tr>${this.#settings.addCounter ? `<td>${item.title[0]}</td>` : ''}<td>${this.#settings.addUserlink ? '@' : ''}${item.title[1]}</td><td>${item.count[0]}</td><td>${item.count[1]}</td></tr>\n`;
				}
			});
			return converted;
		}

	convertText(text) {
		let converted = '';
		if (text.indexOf('\'') === 0) text = text.substr(1, text.length).trim();
		if (text.length === 0) return '';
		if (this.#settings.useMarkdown) {
			converted = this.markdown.render(text);
		} else {
			converted = '<p>' + text + '</p>'
		}
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
				this.lastConvertedType = this.checkType(block);

				if (convertedType > 0 && convertedType!== this.lastConvertedType) convertedType = DataType.Mixed;
				else convertedType = this.lastConvertedType;

				if (this.lastConvertedType === DataType.Text) {
					converted += this.convertText(block);
				} else {
					converted += "<table class='table table-striped table-hover table-condensed'>\n";
					converted += this.writeTableHeader(text);
					switch (this.lastConvertedType) {
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
							converted += '<tr><td>Неизвестный вариант</td></tr>';
							break;
					}
					converted += '</table>\n';
				}
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
