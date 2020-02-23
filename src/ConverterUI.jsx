import React from 'react';

// import Settings from './Settings.js';
 import Switcher from './Switcher';
 import Converter from './Converter';

 const Notes = ()=>{
	 let types = ["Наблюдатели проекта",
		 'Эксперты проекта',
		 'Подпроекты зонтичного проекта'
	 ];
	 
	 return <div className='panel panel-notes'><header>Поддерживаемые варианты</header>
	 <div className='panel-body'>
			 <ul>{types.map(type => <li>{type}</li>)}</ul>
	 </div>
	 </div>
 }

class ConverterUI extends React.Component {

	componentDidMount() {
		this.setState({ value: this.converter.convert(this.areaIn.value)});
	}
	constructor(props) {
		super(props);
		this.state = {value: "", html: false};
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);

		this.converter = new Converter();

	}

	onChangeHandler (e) {
		const val = e.target.value;
		this.setState({ value: this.converter.convert(val)});
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
				<Switcher clickHandler={this.onClickHandler} isHTML={this.state.html} />
				<div className='in-wp'>
					<textarea className='in' autoFocus onChange={this.onChangeHandler} ref={(el) => { this.areaIn = el; }} 
					defaultValue={this.props.text}/>
					{/* <Settings/> */}
					<Notes/>
				</div>
				<div className={this.state.html?'html':'textarea'}>
					<textarea className='out' ref={(el) => { this.areaOut = el; }} value={this.state.value} readOnly 
					onFocus={()=>{this.areaOut.select();}}
					/>
					<div className='html' dangerouslySetInnerHTML={this.showHTML()}/>
				</div>
			</>
		);
	}
}

export default ConverterUI;