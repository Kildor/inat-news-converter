import React from 'react';

export default ({ handler, settings }) => {
		return (
			<div className='panel-settings panel'>
				<header>Настройки вывода</header>
				<div className='panel-body'>
				<label>
					<input name='showHeader' type='checkbox' onChange={handler} checked={settings.showHeader}/>&nbsp;
						Показывать заголовок таблицы
				</label>
				<label>
					<input name='latinFirst' type='checkbox' onChange={handler} checked={settings.latinFirst}/>&nbsp;
						Латинское название вначале
				</label>
			</div>
			</div>
		);
	};
