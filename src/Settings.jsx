import React from 'react';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = { showHeader: false };
		this.onChangeHandler = this.onChangeHandler.bind(this);
	}
	onChangeHandler(e) {
		const checked = e.target.getAttribute('checked');
		this.setState({ showHeader: checked });
	}

	render() {
		return (
			<div className='settings'>
				<label>
					<input name='showHeader' type='checkbox' onChange={this.onChangeHandler} checked={this.state.showHeader}/>
						Показывать заголовок таблицы
				</label>

			</div>
		);
	}
}

export default Settings;