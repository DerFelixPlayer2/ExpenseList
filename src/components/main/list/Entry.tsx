import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { eventEmitter } from '../../../Globals';

interface EntryProps {
	style?: any;
	onPress: () => void;
	name: string;
	timestamp: number;
	price: number;
}

interface EntryState {
	ago: string;
	popupOpen: boolean;
}

export default class Entry extends React.Component<EntryProps, EntryState> {
	state = {
		ago: Entry.getAgo(this.props.timestamp),
		popupOpen: false,
	};

	private static getAgo(timestamp: number): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = (now.getTime() - date.getTime()) / 1000;
		if (diff < 86400) {
			if (diff < 60) return `Vor weniger als einer Minute`;
			else if (diff <= 180) return `Vor wenigen Minuten`;
			else if (diff < 3600) return `Vor ${Math.floor(diff / 60)} Minuten`;
			else {
				const h = Math.floor(diff / 3600);
				if (h === 1) return `Vor einer Stunde`;
				else return `Vor ${h} Stunden`;
			}
		} else if (diff < 172800) {
			return 'Gestern';
		} else {
			return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
		}
	}

	private getStyles = () => {
		if (this.state.popupOpen) {
			return {
				...this.props.style,
				...styles.container,
				opacity: 0.7,
			};
		} else {
			return {
				...this.props.style,
				...styles.container,
			};
		}
	};

	private popupOpen = () => {
		this.setState({
			popupOpen: true,
		});
	};

	private popupClose = () => {
		this.setState({
			popupOpen: false,
		});
	};

	private onUpdate = () => {
		this.setState({
			ago: Entry.getAgo(this.props.timestamp),
		});
	};

	componentDidMount() {
		eventEmitter.addListener('updateEntries', this.onUpdate);
		eventEmitter.addListener('onPopupOpen', this.popupOpen);
		eventEmitter.addListener('onPopupClose', this.popupClose);
	}

	componentWillUnmount() {
		eventEmitter.removeListener('updateEntries', this.onUpdate);
		eventEmitter.removeListener('onPopupOpen', this.popupOpen);
		eventEmitter.removeListener('onPopupClose', this.popupClose);
	}

	render() {
		return (
			<Pressable style={() => this.getStyles()} onPress={this.props.onPress}>
				<View style={styles.top_wrap}>
					<Text style={{ ...styles.text_main, ...styles.name }}>
						{this.props.name}
					</Text>
					<Text
						style={{
							...styles.text_main,
							color: this.props.price < 0 ? '#0ab553' : 'white',
						}}>
						??? {Math.abs(this.props.price).toFixed(2)}
					</Text>
				</View>
				<View>
					<Text style={styles.text_sub}>{this.state.ago}</Text>
				</View>
			</Pressable>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#292938',

		marginTop: 5,
		paddingTop: 10,
		padding: 15,
	},
	top_wrap: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text_main: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	name: {
		flexBasis: '75%',
		flexShrink: 1,

		marginRight: 20,
	},
	text_sub: {
		color: 'white',
		opacity: 0.7,
		fontSize: 12,
	},
});
