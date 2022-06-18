import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { eventEmitter } from '../../Globals';
import AddButton from './AddButton';
import SumDisplay from './SumDisplay';

interface TopNavProps {
	style?: any;
}

interface TopNavState {
	isOnList: boolean;
}

export default class TopNav extends React.Component<TopNavProps, TopNavState> {
	state = {
		isOnList: true,
	};

	private getStyle = () => {
		return {
			...this.props.style,
			...styles.container,
		};
	};

	private onLeaveList = () => {
		this.setState({ isOnList: false });
	};

	private onEntryList = () => {
		this.setState({ isOnList: true });
	};

	componentDidMount() {
		eventEmitter.addListener('leaveList', this.onLeaveList);
		eventEmitter.addListener('entryList', this.onEntryList);
	}

	componentWillUnmount() {
		eventEmitter.removeListener('leaveList', this.onLeaveList);
		eventEmitter.removeListener('entryList', this.onEntryList);
	}

	render() {
		return (
			<View style={this.getStyle()}>
				<Text style={styles.text}>Expense List</Text>
				<SumDisplay />
				{this.state.isOnList && <AddButton style={styles.btn} />}
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
