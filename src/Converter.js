import DataType from './DataType.js';

class Converter {

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

		convert = (text) => {
			let converted = '';
			converted += "<table class='table table-striped table-hover table-condensed'>\n";
			text = text.trim();
			if (text.length === 0)
				return '';
			let isPeople = this.checkIfPeople(text);
			switch (isPeople) {
				case DataType.Observers:
					// converted += '<thead><tr><th>Место</th><th>Наблюдатель</th><th>Наблюдений</th><th>Видов</th></tr></thead>\n';
					text.split('\n').forEach(line => {
						// if ()
						converted += line.trim().replace(/^(.+)\t(.+)\t(.+)\t(.+)$/, '<tr><td>$1</td> <td>@$2</td> <td>$3</td> <td>$4</td></tr>\n');
					});
					break;
				case DataType.Experts:
					text.split('\n').forEach(line => {
						converted += line.trim().replace(/^(.+)\t(.+)\t(.+)$/, '<tr><td>$1</td> <td>@$2</td> <td>$3</td></tr>\n');
					});
					break;
				default:
					let count = [], titles = [];
					const regexpCount = /^[0-9 ]+$/;
					text.split('\n').forEach(line => {
						line = line.trim();
						if (regexpCount.test(line))
							count.push(line);
						else
							titles.push(line);
					});
					if (Math.max(count.length, titles.length) > 0)
						converted += '<thead><tr><th>Проект</th><th>Количество</th></tr></thead>\n';
					for (let i = 0, j = Math.max(count.length, titles.length); i < j; i++) {
						converted += `<tr><td>${titles[i]}</td><td>${count[i]}</td></tr>\n`;
					}
					break;
			}
			converted += '</table>\n';
			return converted;
		};
}

export default Converter;