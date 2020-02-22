import React from 'react';
export default ({clickHandler, isHTML})=>{
	let switcherClassName = "switcher";
	if (isHTML) switcherClassName +=" switch-right"
		return <button className='switch' onClick={clickHandler}>
			Код для вставки	 
			<span className={switcherClassName}></span>
			 	Предпросмотр
		</button>;
};