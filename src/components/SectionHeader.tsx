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
		return <Text style={styles.header}>{this.props.title}</Text>;
	}
}

export default SectionHeader;

const styles = StyleSheet.create({
	header: {
		backgroundColor: 'black',
		color: 'white',
	},
});
