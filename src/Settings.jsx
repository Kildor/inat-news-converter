import React from 'react';
import preferences from './preferences.json';
import Panel from './Panel';

const Setting = (props) => {
	return (
		<label>
			<input name={props.name} type='checkbox' onChange={props.handler} checked={props.value} />&nbsp;
						{props.children}
		</label>
	);
}
export default ({ handler, settings }) => {
	let s = preferences.map(pref => <Setting key={pref.name} name={pref.name} handler={handler} value={settings[pref.name]} >{pref.title}{pref.note?<><br/><small>{pref.note}</small></>:null}</Setting>);

	return (<Panel className='panel-settings' title='Настройки конвертера'>
		{s}
	</Panel>);
};