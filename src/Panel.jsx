import React from 'react';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { collapsed: false };
	}
	render() {

		return (
			<div className={'panel ' + this.props.className + ' ' + (this.state.collapsed ? 'collapsed' : '')}>
				<header><i className='collapse-toggler' onClick={() => { this.setState({ collapsed: !this.state.collapsed }) }}>▼</i> {this.props.title}</header>
				<div className='panel-body'>
					{this.props.children}
				</div>
			</div>
		);
	}
};