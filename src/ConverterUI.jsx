import React, {Component} from 'react';

import Settings from './Settings';
 import Converter from './Converter';
import DataType from './DataType';
import Header from './Header';
import Help from './Help';
import Panel from './Panel';
import preferences from './preferences.json';
import './App.scss';

 const Notes = (props)=>{
	 let types = [{key: DataType.Observers, title: "Наблюдатели проекта"},
		 { key: DataType.Experts, title: 'Эксперты проекта'},
		 { key: DataType.Species, title: 'Виды проекта'},
		 { key: DataType.Subprojects, title: 'Подпроекты зонтичного проекта'},
		 { key: DataType.Summary, title: 'Обзорные данные проекта'},
		 { key: DataType.Text, title: 'Текст (разбиение на абзацы).', note: 'Если скрипт неверно разбирает строку, начните её со знака «\'»'},
		 { key: DataType.Mixed, title: 'Смешанные данные (разделённые двумя переносами строки)'},
	 ];

	 return <Panel title='Поддерживаемые варианты данных' className='panel-notes'>
		 <ul>{types.map(type => <li className={type.key === props.currentType ? "active" : null} key={type.key}>{type.title} {type.key < 5 && <var>!({type.key})</var>}{!!type.note && <small>{type.note}</small>}</li>)}</ul>
	 </Panel>
 }

class ConverterUI extends Component {

	componentDidMount() {
		this.setState({ value: this.converter.convert(this.areaIn.value)});
	}
	constructor(props) {
		super(props);
		this.state = {
			value: "", 
			html: true, 
			currentType: DataType.UNKNOWN,
			settings: {}
		};
		for(let p of preferences) {
			this.state.settings[p.name] = p.default;
		}
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.copyHandler = this.copyHandler.bind(this);
		this.onClickSwitcherHandler = this.onClickSwitcherHandler.bind(this);
		this.onChangeSettingsHandler = this.onChangeSettingsHandler.bind(this);
		this.onClearHandler = this.onClearHandler.bind(this);

		this.converter = new Converter(this.state.settings);
	}

	copyHandler(e) {
			navigator.clipboard.writeText(this.areaOut.value).then(() => this.setState({ copied: true }));
			setTimeout(() => {
				this.setState({ copied: false })
			}, 5000)
	}
	onChangeHandler (e) {
		this.areaIn.value = this.areaIn.value.replace(/\r/g,'');
		this.setState({ value: this.converter.convert(this.areaIn.value), currentType: this.converter.lastConvertedType,copied:false });
	}
	onClickSwitcherHandler (e) {
		this.setState({html: !this.state.html});
	}
	onClearHandler (e) {
		this.areaIn.value = '';
		this.onChangeHandler(e);
	}

	onChangeSettingsHandler (e) {
		let newSettings = this.state.settings;
		newSettings[e.target.name]=e.target.checked;
		this.setState({settings: newSettings});
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
						<div className='wrapper'>
					<textarea className='in' autoFocus onChange={this.onChangeHandler} ref={(el) => { this.areaIn = el; }} 
					defaultValue={this.props.text}/>
					<Help/>
					<button className='btn-clear' onClick={this.onClearHandler} title='Clear'><span role='img' aria-label='Clear'>❌</span></button>
				</div>
					<Notes currentType={this.state.currentType}/>
				</div>
				<div className={this.state.html?'html':'textarea'}>
					<div className='wrapper'>
					<textarea className='out' ref={(el) => { this.areaOut = el; }} value={this.state.value} readOnly 
					onFocus={()=>{this.areaOut.select();}}
					/>
					<div className='html' dangerouslySetInnerHTML={this.showHTML()} />
						{navigator.clipboard && this.state.value.length > 0 ? 
						<button
							onClick={this.copyHandler} 
							title="Не забудьте выбрать 'Ничего' в настройке 'Форматирование'" 
							className={"btn-copy" + (this.state.copied ? ' success' : '')}
							><span className='success-mark'>✔</span> {(this.state.copied ? 'Copied' : 'Copy')}</button>
						: null
					}
						</div>

						<Settings handler={this.onChangeSettingsHandler} settings={this.state.settings} />
				</div>
				</main>
			</div>
		);
	}
}

export default ConverterUI;