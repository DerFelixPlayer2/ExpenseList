import { enableExpoCliLogging } from 'expo/build/logs/Logs';
import React from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Button } from 'react-native';

interface PopUpProps {
	[key: string]: any;
	style?: any;
	isVisible: boolean;
	onRequestClose: () => void;
	callback: (canceled: boolean, data?: { name: string; price: number }) => void;
}

interface PopUpState {
	name: string;
	price: number;
}

export default class PopUp extends React.Component<PopUpProps, PopUpState> {
	state = { name: '', price: 0 };

	shouldComponentUpdate(nextProps: PopUpProps) {
		return this.props.isVisible !== nextProps.isVisible;
	}

	render() {
		return (
			<View style={styles.centeredView}>
				<Modal
					animationType="slide"
					transparent={true}
					onRequestClose={this.props.onRequestClose}
					visible={this.props.isVisible}>
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
								<Button
									title="Cancel"
									onPress={() => this.props.callback(true)}
								/>
								<Button
									title="Add"
									onPress={() =>
										this.props.callback(false, {
											name: this.state.name,
											price: this.state.price,
										})
									}
								/>
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
