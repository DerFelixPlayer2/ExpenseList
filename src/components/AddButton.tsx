import React from 'react';
import { StyleSheet, View, Text, Pressable, Button } from 'react-native';

interface AddButtonProps {
	style?: any;
	onPress: () => void;
}

interface AddButtonState {}

export default class AddButton extends React.Component<
	AddButtonProps,
	AddButtonState
> {
	constructor(props: AddButtonProps) {
		super(props);

		this.getStyles = this.getStyles.bind(this);
	}

	private getStyles() {
		return {
			...styles.container,
			...this.props.style,
		};
	}

	render() {
		return (
			<Pressable style={this.getStyles()} onPress={this.props.onPress}>
				<View style={styles.inner_v1} />
				<View style={styles.inner_h} />
				<View style={styles.inner_v2} />
			</Pressable>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		//		backgroundColor: 'green',

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		zIndex: 99,
		margin: '10%',
	},
	inner_h: {
		backgroundColor: 'white',
		borderRadius: 1,
		width: '35%',
		height: '5%',
	},
	inner_v1: {
		backgroundColor: 'white',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderRadius: 100,
		width: '5%',
		height: '15%',
	},
	inner_v2: {
		backgroundColor: 'white',
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderRadius: 100,
		width: '5%',
		height: '15%',
	},
});
