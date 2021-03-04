const DataType = Object.freeze({
	UNKNOWN: 0,
	Observers: 1,
	Experts: 2,
	Subprojects: 3,
	Species: 4,
	Summary: 5,
	Tabbed: 6,
	Mixed: 7,
	Text: 8,
});

const types = [
	{ key: DataType.Observers, title: "Наблюдатели проекта" },
	{ key: DataType.Experts, title: 'Эксперты проекта' },
	{ key: DataType.Species, title: 'Виды проекта' },
	{ key: DataType.Subprojects, title: 'Подпроекты зонтичного проекта' },
	{ key: DataType.Summary, title: 'Обзорные данные проекта' },
	{ key: DataType.Tabbed, title: 'Данные, разделённые табуляцией' },
	{ key: DataType.Text, title: 'Текст (разбиение на абзацы).', note: 'Если скрипт неверно разбирает строку, начните её со знака «\'»' },
	{ key: DataType.Mixed, title: 'Смешанные данные (разделённые двумя переносами строки)' },
];
export default DataType;
export { types };