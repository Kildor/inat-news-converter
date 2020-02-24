import React, {Component} from 'react';

import Settings from './Settings';
 import Switcher from './Switcher';
 import Converter from './Converter';
import DataType from './DataType';

 const Notes = (props)=>{
	 let types = [{key: DataType.Observers, title: "Наблюдатели проекта"},
		 { key: DataType.Experts, title: 'Эксперты проекта'},
		 { key: DataType.Species, title: 'Виды проекта'},
		 { key: DataType.Subprojects, title: 'Подпроекты зонтичного проекта'}
	 ];

	 return <div className='panel panel-notes'><header>Поддерживаемые варианты</header>
	 <div className='panel-body'>
	<ul>{types.map(type => <li className={type.key === props.currentType ? "active":null } key={type.key}>{type.title}</li>)}</ul>
	 </div>
	 </div>
 }

class ConverterUI extends Component {

	componentDidMount() {
		this.setState({ value: this.converter.convert(this.areaIn.value)});
	}
	constructor(props) {
		super(props);
		this.state = {value: "", html: false, currentType:DataType.UNKNOWN, showHeader: true, latinFirst:false};
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onClickSwitcherHandler = this.onClickSwitcherHandler.bind(this);
		this.onChangeSettingsHandler = this.onChangeSettingsHandler.bind(this);

		this.converter = new Converter({ showHeader: this.state.showHeader, latinFirst: this.state.latinFirst});
	}


	onChangeHandler (e) {
		this.setState({ value: this.converter.convert(e.target.value), currentType: this.converter.lastConvertedType });
	}
	onClickSwitcherHandler (e) {
		this.setState({html: !this.state.html});	
	}

	onChangeSettingsHandler (e) {
		let newSettings = {};
		newSettings[e.target.name]=e.target.checked;
		this.setState(newSettings);
		this.converter.updateSettings(newSettings);
		this.setState({ value: this.converter.convert(this.areaIn.value)});	

	}

	showHTML(){
		return {__html:this.state.value};
	}

	render() {
		return (
			<>
				<Switcher clickHandler={this.onClickSwitcherHandler} isHTML={this.state.html} />
				<div className='in-wp'>
					<textarea className='in' autoFocus onChange={this.onChangeHandler} ref={(el) => { this.areaIn = el; }} 
					defaultValue={this.props.text}/>
					<Notes currentType={this.state.currentType}/>
				</div>
				<div className={this.state.html?'html':'textarea'}>
					<textarea className='out' ref={(el) => { this.areaOut = el; }} value={this.state.value} readOnly 
					onFocus={()=>{this.areaOut.select();}}
					/>
					<div className='html' dangerouslySetInnerHTML={this.showHTML()} />
					<Settings handler={this.onChangeSettingsHandler} settings={{showHeader:this.state.showHeader}} />
				</div>
			</>
		);
	}
}

export default ConverterUI;