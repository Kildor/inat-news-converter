import DataType from './DataType.js';

class Converter {
	lastConvertedType = DataType.UNKNOWN;
	#settings = {showHeader:true};
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
			else
				return DataType.Subprojects;
		};

		convertSubProjects = (text) => {
			let converted = '';
			let count = [], titles = [];
			const regexpCount = /^[0-9 ]+$/;
			text.split('\n').forEach(line => {
				line = line.trim();
				if (regexpCount.test(line))
					count.push(line);
				else
					titles.push(line);
			});
			if (Math.max(count.length, titles.length) > 0) {
				if(this.#settings.showHeader) converted += '<thead><tr><th>Проект</th><th>Количество</th></tr></thead>\n';
				for (let i = 0, j = Math.max(count.length, titles.length); i < j; i++) {
					converted += `<tr><td>${titles[i]}</td><td>${count[i]}</td></tr>\n`;
					}
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
						converted += line.trim().replace(/^(.+)\t(.+)\t(.+)\t(.+)$/, '<tr><td>$1</td> <td>@$2</td> <td>$3</td> <td>$4</td></tr>\n');
					});
					break;
				case DataType.Experts:
					if (this.#settings.showHeader) converted += '<thead><tr><th>Место</th><th>Эксперт</th><th>Идентификаций</th></tr></thead>\n';
					text.split('\n').forEach(line => {
						if (/^\D+\t/.test(line)) return;
						converted += line.trim().replace(/^(.+)\t(.+)\t(.+)$/, '<tr><td>$1</td> <td>@$2</td> <td>$3</td></tr>\n');
					});
					break;
				case DataType.Subprojects:
					converted += this.convertSubProjects(text);
					break;

				case DataType.UNKNOWN:
				default:
					converted+='<tr><td>Неизвестный вариант</td></tr/>';
					break;

			}
			converted += '</table>\n';
			return converted;
		};
		updateSettings(newSettings) {
			this.#settings = Object.assign(this.#settings, newSettings);
		}
}

export default Converter;