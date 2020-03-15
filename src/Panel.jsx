import React from 'react';

const mqlMobile = window.matchMedia('screen and (max-device-width: 900px)');
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { collapsed: mqlMobile.matches };
	}
	render() {

		return (
			<div className={'panel ' + this.props.className + ' ' + (this.state.collapsed ? 'collapsed' : '')}>
				<header onClick={() => { this.setState({ collapsed: !this.state.collapsed }) }}><i className='collapse-toggler'>▼</i> {this.props.title}</header>
				<div className='panel-body'>
					{this.props.children}
				</div>
			</div>
		);
	}
};