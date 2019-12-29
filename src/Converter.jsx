import React from 'react';

// import In from './In.jsx';
// import Out from './Out.jsx';

const checkIfPeople = (text)=>{
	let firstLine = text.substr(0, text.indexOf('\n'));
	console.dir(firstLine);
	return /^(\d+)\t(.+)\t(.+)\t(.+)$/.test(firstLine.trim());

}
const convert = (text) =>{
let converted = '';
	converted += "<table class='table table-striped table-hover table-condensed'>\n";
	text = text.trim();
	if (text.length === 0) return '';
	let isPeople = checkIfPeople(text);

	if (isPeople) {
	text.split('\n').forEach(line=>{
		converted += line.trim().replace(/^(\d+)\t(.+)\t(.+)\t(.+)$/,'<tr><td>$1</td><td>@$2</td><td>$3</td><td>$4</td></tr>\n');
		});
	} else { // subprojects
		let count = [], titles = [];
		const regexpCount = /^[0-9 ]+$/;
		text.split('\n').forEach(line => {
			line = line.trim();
			if (regexpCount.test(line)) count.push(line);
			else  titles.push(line);
		});

		if (Math.max(count.length, titles.length) > 0) 
			for( let i = 0, j = Math.max(count.length, titles.length); i < j; i++) {
				converted += `<tr><td>${titles[i]}</td><td>${count[i]}</td></tr>\n`;
			}


	}
	converted+='</table>\n';
	return converted;
}

class Converter extends React.Component {

	componentDidMount() {
		// this.areaIn.change();
		this.setState({value:convert(this.areaIn.value)});
	}
	constructor(props) {
		super(props);
		this.state = {value: "", html: false};
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	onChangeHandler (e) {
		const val = e.target.value;
		this.setState({ value: convert(val)});
	}
	onClickHandler (e) {
		this.setState({html: !this.state.html});	
	}

	showHTML(){
		return {__html:this.state.value};
	}

	render() {
		return (
			<>
				<div>
					<textarea className='in' autoFocus onChange={this.onChangeHandler} ref={(el) => { this.areaIn = el; }} 
					defaultValue={this.props.text}/>
				</div>
				<div className={this.state.html?'html':'textarea'}>
					<button className='switch' onClick={this.onClickHandler}>Переключиться</button>
					<textarea className='out' ref={(el) => { this.areaOut = el; }} value={this.state.value} readOnly 
					onFocus={()=>{this.areaOut.select();}}
					/>
					<div className='html' dangerouslySetInnerHTML={this.showHTML()}/>
				</div>
			</>
		);
	}
}

export default Converter;