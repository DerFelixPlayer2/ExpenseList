import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AddButton from '../main/AddButton';
import SumDisplay from './SumDisplay';

interface TopNavProps {
	style?: any;
	onAddButtonPress: () => void;
}

interface TopNavState {}

export default class TopNav extends React.Component<TopNavProps, TopNavState> {
	constructor(props: TopNavProps) {
		super(props);

		this.getStyle = this.getStyle.bind(this);
	}

	private getStyle() {
		return {
			...this.props.style,
			...styles.container,
		};
	}

	render() {
		return (
			<View style={this.getStyle()}>
				<Text style={styles.text}>Expense List</Text>
				<SumDisplay />
				<AddButton style={styles.btn} onPress={this.props.onAddButtonPress} />
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
	btn: {
		position: 'absolute',
		right: -23,
		bottom: -14,
	},
});
