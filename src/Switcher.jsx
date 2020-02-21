import React from 'react';


// class Switcher extends React.Component {
// 	constructor(props) {
// 		console.dir(props);
// 		super(props);
// 		this.state = { isHTML: props.isHTML };
// 		this.onClickHandler = this.onClickHandler.bind(this);
// 	}
// 	onClickHandler = () => {
// 		this.setState({ isHTML: !this.state.isHTML });
// 		this.props.clickHandler(this.state.isHTML);
// 	};
// 	render() {
// 		return <button className='switch' onClick={this.onClickHandler}>Переключиться в {this.state.isHTML ? "код" : "HTML"}</button>;
// 	}
// }

export default ({clickHandler, isHTML})=>{
		return <button className='switch' onClick={clickHandler}>Переключиться в {isHTML ? "код" : "HTML"}</button>;
};