import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import React from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TextInput,
	Button,
	GestureResponderEvent,
} from 'react-native';

interface PopUpProps {
	[key: string]: any;
	style?: any;
	isVisible: boolean;
	onRequestClose: () => void;
	callback: (canceled: boolean, data?: { name: string; price: number }) => void;
}

interface PopUpState {
	visible: boolean;
	name: string;
	price: number;
}

export default class PopUp extends React.Component<PopUpProps, PopUpState> {
	constructor(props: PopUpProps) {
		super(props);
		this.state = { visible: this.props.isVisible, name: '', price: 0 };
		this.onAdd = this.onAdd.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	UNSAFE_componentWillReceiveProps(nextProps: PopUpProps) {
		if (nextProps.isVisible !== this.props.isVisible) {
			this.setState({ visible: nextProps.isVisible });
		}
	}

	shouldComponentUpdate(nextProps: PopUpProps, nextState: PopUpState) {
		if (nextState.visible !== this.state.visible) return true;
		return Object.entries(nextProps).some(([key, value]) => {
			return value !== this.props[key];
		});
	}

	private onAdd(e: GestureResponderEvent) {
		this.props.callback(false, {
			name: this.state.name,
			price: this.state.price,
		});
	}

	private onCancel() {
		this.props.callback(true);
	}

	render() {
		return (
			<View style={styles.centeredView}>
				<Modal
					animationType="slide"
					transparent={true}
					onRequestClose={this.props.onRequestClose}
					visible={this.state.visible}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.text}>Name: </Text>
							<TextInput
								placeholder="Meal"
								style={styles.text_input}
								autoCorrect={false}
								numberOfLines={1}
								spellCheck={false}
								keyboardType="default"
								onChangeText={(v) => this.setState({ name: v })}
							/>
							<Text style={styles.text}>Price: </Text>
							<TextInput
								placeholder="12.3"
								style={styles.text_input}
								keyboardType="numeric"
								onChangeText={(v) => this.setState({ price: parseFloat(v) })}
							/>
							<View style={styles.button_wrapper}>
								<Button title="Cancel" onPress={this.onCancel} />
								<Button title="Add" onPress={this.onAdd} />
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	text_input: {
		marginBottom: 10,
		marginTop: 1,
		paddingLeft: 10,
		paddingRight: 10,
		width: 200,
		borderColor: '#000',
		borderWidth: 1,
	},
	button_wrapper: {
		width: '75%',

		marginTop: 20,

		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	text: {},
});
