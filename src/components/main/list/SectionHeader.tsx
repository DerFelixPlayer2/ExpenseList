import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SectionHeaderProps {
	title: string;
}

interface SectionHeaderState {}

class SectionHeader extends React.Component<
	SectionHeaderProps,
	SectionHeaderState
> {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.header}>{this.props.title}</Text>
			</View>
		);
	}
}

export default SectionHeader;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#15141a',

		width: '100%',
		height: 40,

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	header: {
		color: 'white',
		fontWeight: 'bold',

		marginLeft: 15,
	},
});
