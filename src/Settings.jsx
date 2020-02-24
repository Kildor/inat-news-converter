import React from 'react';
import preferences from './preferences.json';

const Setting = (props) => {
	return (
		<label>
			<input name={props.name} type='checkbox' onChange={props.handler} checked={props.value} />&nbsp;
						{props.children}
		</label>
	);
}
export default ({ handler, settings }) => {
let s = preferences.map(pref=><Setting key={pref.name} name={pref.name} handler={handler} value={settings[pref.name]} >{pref.title}{pref.note?<><br/><small>{pref.note}</small></>:null}</Setting>);

		return (
			<div className='panel-settings panel'>
				<header>Настройки конвертера</header>
				<div className='panel-body'>
					{s}
			</div>
			</div>
		);
	};
