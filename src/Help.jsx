import React from 'react'
import Converter from './Converter';
import help from './help.md';

const converter = new Converter({useMarkdown: true});


export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {showPopup:false, help:''}
	}

	onClickHandler = ()=> {
		if (this.state.help==='') {
			console.dir(help)
			fetch(help)
				.then((res)=>res.text())
				.then((text)=>{
					this.setState({ help: converter.convert(text), showPopup: !this.state.showPopup});
					});
		} else {
			this.setState({showPopup: !this.state.showPopup});
		}
	}
	render() {
		return (
			<>
				<button onClick={this.onClickHandler} className={'btn-help' + (this.state.showPopup ? ' active' : '')}>?</button>
			<div className='popup popup-help'>
				<header>
					<button onClick={this.onClickHandler} className='btn-close'>+</button>
					Помощь

				</header>
					<div className='popup-body' dangerouslySetInnerHTML={{__html: this.state.help}}/>
			</div>
				<div className='popup-bg' onClick={this.onClickHandler}></div>
			</>
		);
	}

}