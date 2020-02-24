import DataType from './DataType.js';

class Item {
	count = 0;
	title = [];
}
class Converter {
	lastConvertedType = DataType.UNKNOWN;
	#settings = {showHeader:true, latinFirst: false};
	constructor(settings) {
		this.#settings = Object.assign(this.#settings,settings);
	}

	checkIfPeople(text) {
			let firstLine = text.substr(0, text.indexOf('\n')).trim();
			if (/^(.+)\t(.+)\t(.+)\t(.+)$/.test(firstLine)) {
				return DataType.Observers;
			}
			else if (/^(.+)\t(.+)\t(.+)$/.test(firstLine))
				return DataType.Experts;
			else if (/^\s*[\d ]+\s*$/.test(firstLine))
				return DataType.Subprojects;
			else
				return DataType.Species;
		};

		convertSubProjects = (text) => {
			let converted = '';
			let items = [];
			let item = null;
			const regexpCount = /^[0-9 ]+$/;
			text.split('\n').forEach(line => {
				line = line.trim();
				if (regexpCount.test(line)) {
					if (item != null) items.push(item);
					item = new Item();
					item.count = line;
				}
				else if (item !== null)
					item.title.push(line);
			});
			if (item !== null) items.push(item);

			if (items.length > 0) {
				if(this.#settings.showHeader) converted += '<thead><tr><th>Проект</th><th>Количество</th></tr></thead>\n';
				items.forEach(item => converted += `<tr><td>${item.title[0]}</td><td>${item.count}</td></tr>\n`);
				}
			return converted;
		}
		convertSpecies = (text) => {
			let converted = '';
			let items = [];
			let item = null;
			const regexpCount = /^[0-9]+\s.+$/;
			text.split('\n').forEach(line => {
				line = line.trim();
				if (regexpCount.test(line)) {
					if (item != null) items.push(item);
					item = new Item();
					item.count = line.split(' ')[0];
				}
				else if (item !==null)
					item.title.push(line);
			});
			if (item!==null) items.push(item);

			if (items.length > 0) {
				if(this.#settings.showHeader) converted += '<thead><tr><th>Вид</th><th>Количество наблюдений</th></tr></thead>\n';

				items.forEach(item => {
					let title = '';
					if (item.title.length === 1) {
						title = `<em>${item.title[0]}</em>`;
					} else {
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
		convert = (text) => {
			let converted = '';
			converted += "<table class='table table-striped table-hover table-condensed'>\n";
			text = text.trim();
			if (text.length === 0)
				return '';
			this.lastConvertedType = this.checkIfPeople(text);
			switch (this.lastConvertedType) {
				case DataType.Observers:
					if (this.#settings.showHeader) converted += '<thead><tr><th>Место</th><th>Наблюдатель</th><th>Наблюдений</th><th>Видов</th></tr></thead>\n';
					text.split('\n').forEach(line => {
						if(/^\D+\t/.test(line)) return;
						converted += line.trim().replace(/^(.+)\t(.+)\t(.+)\t(.+)$/, '<tr><td>$1</td><td>@$2</td><td>$3</td><td>$4</td></tr>\n');
					});
					break;
				case DataType.Experts:
					if (this.#settings.showHeader) converted += '<thead><tr><th>Место</th><th>Эксперт</th><th>Идентификаций</th></tr></thead>\n';
					text.split('\n').forEach(line => {
						if (/^\D+\t/.test(line)) return;
						converted += line.trim().replace(/^(.+)\t(.+)\t(.+)$/, '<tr><td>$1</td><td>@$2</td><td>$3</td></tr>\n');
					});
					break;
				case DataType.Subprojects:
					converted += this.convertSubProjects(text);
					break;
				case DataType.Species:
					converted += this.convertSpecies(text);
					break;
				case DataType.UNKNOWN:
				default:
					converted+='<tr><td>Неизвестный вариант</td></tr/>';
					break;

			}
			converted += '</table>\n';
			return converted.replace(/(\/t[dh]>)(<t[dh])/g, '$1 $2');
		};
		updateSettings(newSettings) {
			this.#settings = Object.assign(this.#settings, newSettings);
		}
}

export default Converter;
