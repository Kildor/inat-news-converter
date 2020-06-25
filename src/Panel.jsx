import React, {useState} from 'react';

export default (props) => {
	const [collapsed, setCollapsed] = useState(window.matchMedia('screen and (max-device-width: 900px)').matches);

		return (
			<div className={'panel ' + props.className + ' ' + (collapsed ? 'collapsed' : '')}>
				<header onClick={() => { setCollapsed(!collapsed) }}><i className='collapse-toggler'>▼</i> {props.title}</header>
				<div className='panel-body'>
					{props.children}
				</div>
			</div>
		);
};