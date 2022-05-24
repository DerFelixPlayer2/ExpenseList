import React from 'react';
import Storage from '../Storage';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SumDisplayProps {
	style?: any;
}

interface SumDisplayState {
	sum: number;
	style: any;
}

export default class SumDisplay extends React.Component<
	SumDisplayProps,
	SumDisplayState
> {
	constructor(props: SumDisplayProps) {
		super(props);

		this.state = {
			sum: 0,
			style: this.props.style,
		};

		this.getStyle = this.getStyle.bind(this);
	}

	private getStyle() {
		return {
			...styles.text,
			...this.state.style,
		};
	}

	async componentDidMount() {
		this.setState({
			sum: await Storage.getSum(),
		});
	}

	async componentDidUpdate() {
		const sum = await Storage.getSum();
		if (this.state.sum !== sum) {
			this.setState({ sum });
		}
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
	},
});
