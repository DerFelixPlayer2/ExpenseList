import React from 'react';
import {
	Modal,
	Text,
	Button,
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';

interface DeleteModalProps {
	style?: any;
	isVisible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

interface DeleteModalState {}

export default class DeleteModal extends React.Component<
	DeleteModalProps,
	DeleteModalState
> {
	render() {
		return (
			<View style={styles.centeredView}>
				<Modal
					animationType="none"
					transparent={true}
					onRequestClose={this.props.onCancel}
					visible={this.props.isVisible}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View>
								<Text style={styles.text_primary}>Aufgabe löschen?</Text>
								<Text style={styles.text_secondary}>
									Dieser Eintrag wird dadurch dauerhaft gelöscht. Der
									Löschvorgang kann nicht rückgängig gemacht werden.
								</Text>
							</View>
							<View style={styles.button_wrapper}>
								<TouchableOpacity
									style={styles.btn}
									activeOpacity={0.3}
									onPress={this.props.onCancel}>
									<Text style={styles.btn_text}>NEIN</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.btn}
									activeOpacity={0.3}
									onPress={this.props.onConfirm}>
									<Text style={styles.btn_text}>JA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
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

		width: '85%',
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 5,
		alignItems: 'center',

		borderRadius: 12,

		shadowColor: '#000',
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
		width: '25%',
		padding: 12,

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	btn_text: {
		color: '#cf4a2e',
		fontWeight: 'bold',
	},
	text_primary: {
		alignSelf: 'flex-start',

		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	text_secondary: {
		marginTop: 3,

		color: 'white',
		fontSize: 14,
		opacity: 0.8,
	},
});
