import React from 'react';
import Storage from '../Storage';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SumDisplayProps {}

interface SumDisplayState {
	sum: number;
}

export default class SumDisplay extends React.Component<
	SumDisplayProps,
	SumDisplayState
> {
	componentDidMount() {
		this.setState({
			sum: Storage.getSum(),
		});
	}

	render() {
		if (!this.state?.sum) {
			return (
				<View style={styles.container}>
					<ActivityIndicator />
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<Text style={styles.text}>Summe: € {this.state.sum.toFixed(2)}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#586cff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		width: '100%',
		height: '10%',

		position: 'absolute',
		bottom: 0,
	},
	text: {
		color: '#fff',
		fontSize: 20,
	},
});
