import React from 'react'
import Switcher from './Switcher';
import githubLogo from './GitHub-Mark-Light-32px.png';

export default ({ clickHandler, isHTML })=> {
	return (<header className="App-header">
		<a target='_blank' rel='noopener noreferrer' className='github-link' href='https://github.com/Kildor/inat-news-converter'>
			<img src={githubLogo} alt='Github' /> Github
			</a>
	<h1>iNaturalist конвертер</h1>
		<Switcher clickHandler={clickHandler} isHTML={isHTML} />
				</header>);
}