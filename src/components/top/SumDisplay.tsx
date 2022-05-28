import React from 'react';
import Storage from '../../Storage';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { eventEmitter } from '../../Globals';

interface SumDisplayProps {
	style?: any;
}

interface SumDisplayState {
	sum: number;
}

export default class SumDisplay extends React.Component<
	SumDisplayProps,
	SumDisplayState
> {
	state = {
		sum: 0,
	};

	private getStyle = () => {
		return {
			...styles.text,
			...this.props.style,
		};
	};

	private onListChange = async () => {
		console.info('display update');
		this.setState({
			sum: await Storage.getSum(),
		});
	};

	async componentDidMount() {
		eventEmitter.addListener('listChanged', this.onListChange);
		this.onListChange();
	}

	componentWillUnmount() {
		console.warn('display unmount');
		eventEmitter.removeListener('listChanged', this.onListChange);
	}

	render() {
		if (!this.state?.sum && this.state?.sum !== 0) {
			return (
				<View style={this.getStyle()}>
					<ActivityIndicator />
				</View>
			);
		}

		return <Text style={this.getStyle()}>€ {this.state.sum.toFixed(2)}</Text>;
	}
}

const styles = StyleSheet.create({
	text: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
	},
});
