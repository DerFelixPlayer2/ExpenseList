import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Storage from '../../../Storage';
import { eventEmitter } from '../../../Globals';
import AutoCompletionTextInput from './AutoCompletionTextInput';

interface PopUpProps {}

interface PopUpState {
	visible: boolean;
	name: string;
	price: number;
	firstTextInputDone: boolean;
	hints: { name: string[]; price: string[] };
}

export default class PopUp extends React.Component<PopUpProps, PopUpState> {
	private: boolean = false;
	state: PopUpState = {
		name: '',
		price: 0,
		visible: false,
		firstTextInputDone: false,
		hints: { name: [], price: [] },
	};

	private onAddButtonClick = () => {
		eventEmitter.emit('onPopupOpen');
		this.setState({ visible: true });
	};

	private onCancel = () => {
		this.setState({ visible: false, firstTextInputDone: false });
		eventEmitter.emit('onPopupClose');
	};

	private onAdd = async () => {
		this.setState({
			visible: false,
			firstTextInputDone: false,
			hints: {
				name: this.state.hints.name.includes(this.state.name)
					? this.state.hints.name
					: [...this.state.hints.name, this.state.name],
				price: this.state.hints.price.includes(this.state.price.toFixed(2))
					? this.state.hints.price
					: [...this.state.hints.price, this.state.price.toFixed(2)],
			},
		});
		eventEmitter.emit('onPopupClose');
		Storage.saveEntry(this.state.name, this.state.price);
	};

	async componentDidMount() {
		eventEmitter.addListener('addButtonPressed', this.onAddButtonClick);

		const filtered: { name: string[]; price: number[] } = {
			name: [],
			price: [],
		};
		const entries = await Storage.loadEntries();
		entries.forEach((entry) => {
			if (!filtered.name.includes(entry.name)) filtered.name.push(entry.name);
			if (!filtered.price.includes(entry.price))
				filtered.price.push(entry.price);
		});
		this.setState({
			hints: {
				name: filtered.name,
				price: filtered.price.map((v) => v.toFixed(2)),
			},
		});
	}

	shouldComponentUpdate(_: PopUpProps, nextState: PopUpState) {
		return (
			this.state.visible !== nextState.visible ||
			this.state.firstTextInputDone !== nextState.firstTextInputDone
		);
	}

	componentWillUnmount() {
		eventEmitter.removeListener('addButtonPressed', this.onAddButtonClick);
	}

	render() {
		return (
			<View>
				<View style={styles.centeredView}>
					<Modal
						animationType="none"
						transparent={true}
						onRequestClose={this.onCancel}
						visible={this.state.visible}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<View>
									<Text style={styles.text_primary}>Name: </Text>
									<AutoCompletionTextInput
										hints={this.state.hints.name}
										placeholder="Meal"
										shouldShowHintsOnInitialRender={true}
										keyboardType="default"
										onSubmit={() => {
											this.setState({ firstTextInputDone: true });
										}}
										onChangeText={(name) => this.setState({ name })}
									/>
								</View>
								<View>
									<Text style={styles.text_primary}>Preis: </Text>
									<AutoCompletionTextInput
										hints={this.state.hints.price}
										placeholder="12.3"
										shouldShowHintsOnInitialRender={false}
										keyboardType="numeric"
										hintTrigger={this.state.firstTextInputDone}
										onSubmit={() => {
											this.setState({ firstTextInputDone: false });
										}}
										onChangeText={(v) =>
											this.setState({ price: parseFloat(v) })
										}
									/>
								</View>
								<View style={styles.button_wrapper}>
									<TouchableOpacity
										onPress={this.onCancel}
										style={styles.btn}
										activeOpacity={0.3}>
										<Text style={styles.btn_text}>CANCEL</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={this.onAdd}
										style={styles.btn}
										activeOpacity={0.3}>
										<Text style={styles.btn_text}>ADD</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		backgroundColor: '#343444',

		width: '80%',
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 5,
		alignItems: 'center',

		borderRadius: 12,

		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button_wrapper: {
		width: '100%',

		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	btn: {
		width: 80,
		padding: 12,
		paddingTop: 20,

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	btn_text: {
		color: '#cf4a2e',
		fontWeight: 'bold',
	},
	text_primary: {
		color: 'white',
		fontSize: 15,
		fontWeight: 'bold',
	},
});
