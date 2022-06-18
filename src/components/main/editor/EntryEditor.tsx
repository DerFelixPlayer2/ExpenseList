import React from 'react';
import {
	Text,
	StyleSheet,
	Pressable,
	View,
	Image,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';
import EditableText from '../EditableText';
import Storage from '../../../Storage';
import { IEntry } from '../../../types';
import { eventEmitter } from '../../../Globals';
import DeleteModal from './DeleteModal';

interface EntryEditorProps {
	style?: any;
	entry: IEntry;
}

interface EntryEditorState {
	name: string;
	price: string;
	deleteModalVisible: boolean;
	spinnerVisible: boolean;
}

export default class EntryEditor extends React.Component<
	EntryEditorProps,
	EntryEditorState
> {
	state = {
		name: this.props.entry.name || '',
		price: this.props.entry.price?.toFixed(2) || '0.00',
		deleteModalVisible: false,
		spinnerVisible: false,
	};

	private saveToStorage = async () => {
		await Storage.updateOrCreate(this.props.entry.id, {
			name: this.state.name,
			price: parseFloat(this.state.price),
		});
	};

	private deleteEntry = async () => {
		this.setState({ deleteModalVisible: false, spinnerVisible: true });
		await Storage.deleteEntry(this.props.entry.id);
		eventEmitter.emit('entryDeleted');
	};

	private getStyles = () => {
		if (this.state.deleteModalVisible) {
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

	render() {
		return (
			<Pressable
				style={this.getStyles}
				onPress={() => {
					eventEmitter.emit('backgroundClicked');
				}}>
				<>
					<Text style={styles.text_secondary}>Typ:</Text>
					<Text style={styles.text_primary}>
						{parseFloat(this.state.price) < 0 ? 'Einnahme' : 'Ausgabe'}
					</Text>
				</>
				<>
					<Text style={styles.text_secondary}>Name:</Text>
					<EditableText
						style={styles.text_primary}
						keyboardType="default"
						onDone={(name) => {
							this.setState({ name }, this.saveToStorage);
						}}>
						{this.state.name}
					</EditableText>
				</>
				<>
					<Text style={styles.text_secondary}>
						{parseFloat(this.state.price) < 0 ? 'Einnahme:' : 'Ausgabe:'}
					</Text>
					<View style={styles.price_wrapper}>
						<Text style={styles.text_primary}>€ </Text>
						<EditableText
							style={styles.text_primary}
							keyboardType="numeric"
							key={this.state.price}
							onDone={(v) => {
								this.setState(
									{
										price:
											(this.state.price.charAt(0) === '-' ? '-' : '') +
											Math.abs(parseFloat(v)).toFixed(2),
									},
									this.saveToStorage
								);
							}}>
							{Math.abs(parseFloat(this.state.price)).toFixed(2)}
						</EditableText>
					</View>
				</>
				<>
					{this.state.spinnerVisible && <ActivityIndicator size="large" />}
					<TouchableOpacity
						style={styles.delete_icon}
						activeOpacity={0.3}
						onPress={() => this.setState({ deleteModalVisible: true })}>
						<Image
							source={require('../../../../assets/delete.png')}
							fadeDuration={0}
						/>
					</TouchableOpacity>
					<DeleteModal
						isVisible={this.state.deleteModalVisible}
						onCancel={() => this.setState({ deleteModalVisible: false })}
						onConfirm={this.deleteEntry}
					/>
				</>
			</Pressable>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#292938',

		padding: 20,
	},
	text_primary: {
		color: 'white',
		fontSize: 20,

		marginBottom: 10,
		marginTop: 3,
	},
	text_secondary: {
		color: 'white',
		opacity: 0.7,
		fontSize: 14,
	},
	price_wrapper: {
		display: 'flex',
		flexDirection: 'row',
	},
	delete_icon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		padding: 15,

		position: 'absolute',
		bottom: 10,
		right: 10,
	},
});
