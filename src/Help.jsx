import React, {useState, useEffect} from 'react'
import Converter from './Converter';
import helpFile from './help.md';

const converter = new Converter({useMarkdown: true});


export default () => {

	const [isActive, setActive] = useState(false);
	const [help, setHelp] = useState("");


	useEffect(() => {
		if (help === '') {
			fetch(helpFile)
				.then((res) => res.text())
				.then((text) => {
					setHelp(converter.convert(text));
				});
		}
	});

	const onClickHandler = () => setActive(!isActive);

		return (
			<>
				<button onClick={onClickHandler} className={'btn-help' + (isActive ? ' active' : '')}>?</button>
			<div className='popup popup-help'>
				<header>
					<button onClick={onClickHandler} className='btn-close'>+</button>
					Помощь

				</header>
					<div className='popup-body' dangerouslySetInnerHTML={{__html: help}}/>
			</div>
				<div className='popup-bg' onClick={onClickHandler}></div>
			</>
		);

}