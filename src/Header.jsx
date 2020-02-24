import React from 'react'
import Switcher from './Switcher';

export default ({ clickHandler, isHTML })=> {
	return (<header className="App-header">
	<h1>iNaturalist конвертер</h1>
		<Switcher clickHandler={clickHandler} isHTML={isHTML} />
				</header>);
}