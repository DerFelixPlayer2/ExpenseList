import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { eventEmitter } from '../../Globals';

interface AddButtonProps {
	style?: any;
}

interface AddButtonState {}

export default class AddButton extends React.Component<
	AddButtonProps,
	AddButtonState
> {
	private getStyles = () => {
		return {
			...styles.container,
			...this.props.style,
		};
	};

	private onPress = () => {
		eventEmitter.emit('addButtonPressed');
	};

	render() {
		return (
			<TouchableOpacity
				style={this.getStyles()}
				onPress={this.onPress}
				activeOpacity={0.4}>
				<View style={styles.inner_v1} />
				<View style={styles.inner_h} />
				<View style={styles.inner_v2} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
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
