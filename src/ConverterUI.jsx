import React, {Component} from 'react';

import Settings from './Settings';
 import Converter from './Converter';
import DataType from './DataType';
import Header from './Header';
import './App.scss';

 const Notes = (props)=>{
	 let types = [{key: DataType.Observers, title: "Наблюдатели проекта"},
		 { key: DataType.Experts, title: 'Эксперты проекта'},
		 { key: DataType.Species, title: 'Виды проекта'},
		 { key: DataType.Subprojects, title: 'Подпроекты зонтичного проекта'}
	 ];

	 return <div className='panel panel-notes'><header>Поддерживаемые варианты данных</header>
	 <div className='panel-body'>
	<ul>{types.map(type => <li className={type.key === props.currentType ? "active":null } key={type.key}>{type.title}</li>)}</ul>
	 </div>
	 </div>
 }

class ConverterUI extends Component {

	componentDidMount() {
		console.dir(navigator.clipboard);
		this.setState({ value: this.converter.convert(this.areaIn.value)});
	}
	constructor(props) {
		super(props);
		this.state = {value: "", 
			html: true, 
			currentType:DataType.UNKNOWN, 
			showHeader: true, 
			latinFirst:false,
			copied: false
		};
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onClickSwitcherHandler = this.onClickSwitcherHandler.bind(this);
		this.onChangeSettingsHandler = this.onChangeSettingsHandler.bind(this);

		this.converter = new Converter({ showHeader: this.state.showHeader, latinFirst: this.state.latinFirst});
	}


	onChangeHandler (e) {
		this.setState({ value: this.converter.convert(e.target.value), currentType: this.converter.lastConvertedType,copied:false });
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
			<div className="App">
				<Header clickHandler={this.onClickSwitcherHandler} isHTML={this.state.html} />
				<main>
				<div className='in-wp'>
					<textarea className='in' autoFocus onChange={this.onChangeHandler} ref={(el) => { this.areaIn = el; }} 
					defaultValue={this.props.text}/>
					<Notes currentType={this.state.currentType}/>
				</div>
				<div className={this.state.html?'html':'textarea'}>
					<div className='wrapper'>
					<textarea className='out' ref={(el) => { this.areaOut = el; }} value={this.state.value} readOnly 
					onFocus={()=>{this.areaOut.select();}}
					/>
					<div className='html' dangerouslySetInnerHTML={this.showHTML()} />
						{navigator.clipboard && this.state.value.length > 0 ? 
						<button onClick={() => {
								navigator.clipboard.writeText(this.areaOut.value).then(() => this.setState({ copied: true }));
							setTimeout(()=>{
								this.setState({copied:false})
							}, 5000)
								}} className={"btn-copy" + (this.state.copied ? ' success' : '')}><span className='success-mark'>✔</span> {(this.state.copied ? 'Copied' : 'Copy')}</button>
						: null
					}
						</div>

					<Settings handler={this.onChangeSettingsHandler} settings={{showHeader:this.state.showHeader}} />
				</div>
				</main>
			</div>
		);
	}
}

export default ConverterUI;