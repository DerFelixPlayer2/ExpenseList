import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SumDisplay from './SumDisplay';

interface TopNavProps {
	style?: any;
}

interface TopNavState {}

export default class TopNav extends React.Component<TopNavProps, TopNavState> {
	constructor(props: TopNavProps) {
		super(props);

		this.getStyle = this.getStyle.bind(this);
	}

	private getStyle() {
		return {
			...styles.container,
			...this.props.style,
		};
	}

	render() {
		return (
			<View style={this.getStyle()}>
				<Text style={styles.text}>Expense List</Text>
				<SumDisplay />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#cf4a1d',

		paddingLeft: '10%',
		paddingTop: '5%',

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	text: {
		color: 'white',
		fontSize: 23,

		paddingBottom: '3%',
	},
});
