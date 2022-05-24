import React from 'react';
import { StyleSheet, View, Text, Pressable, Button } from 'react-native';

interface AddButtonProps {
	style?: any;
	onPress: () => void;
}

interface AddButtonState {
	style: any;
}

export default class AddButton extends React.Component<
	AddButtonProps,
	AddButtonState
> {
	constructor(props: AddButtonProps) {
		super(props);

		this.state = {
			style: this.props.style,
		};

		this.getStyles = this.getStyles.bind(this);
	}

	private getStyles() {
		return {
			...styles.container,
			...this.state.style,
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
		backgroundColor: 'red',

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		borderRadius: 100,
		zIndex: 99,
		margin: '10%',
	},
	inner_h: {
		backgroundColor: 'white',
		borderRadius: 1,
		width: '25%',
		height: '5%',
	},
	inner_v1: {
		backgroundColor: 'white',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderRadius: 1,
		width: '5%',
		height: '10%',
	},
	inner_v2: {
		backgroundColor: 'white',
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderRadius: 1,
		width: '5%',
		height: '10%',
	},
});
