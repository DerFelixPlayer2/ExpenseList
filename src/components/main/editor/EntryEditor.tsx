import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import EditableText from './EditableText';
import Storage from '../../../Storage';
import { IEntry } from '../../../types';
import { eventEmitter } from '../../../Globals';

interface EntryEditorProps {
	style?: any;
	entry: IEntry;
}

interface EntryEditorState {
	name: string;
	price: string;
}

export default class EntryEditor extends React.Component<
	EntryEditorProps,
	EntryEditorState
> {
	constructor(props: EntryEditorProps) {
		super(props);
		this.state = {
			name: props.entry.name || '',
			price: props.entry.price?.toFixed(2) || '0.00',
		};

		this.saveToStorage = this.saveToStorage.bind(this);
	}

	private async saveToStorage() {
		await Storage.updateOrCreate(this.props.entry.id, {
			name: this.state.name,
			price: parseFloat(this.state.price),
		});
	}

	render() {
		return (
			<Pressable
				style={{ ...this.props.style, ...styles.container }}
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
					<Text style={styles.text_secondary}>Preis:</Text>
					<View style={styles.price_wrapper}>
						<Text style={styles.text_primary}>€ </Text>
						<EditableText
							style={styles.text_primary}
							keyboardType="numeric"
							onDone={(v) => {
								this.setState(
									{
										price: parseFloat(v).toFixed(2),
									},
									this.saveToStorage
								);
							}}>
							{this.state.price.charAt(0) === '-'
								? this.state.price.substring(1)
								: this.state.price}
						</EditableText>
					</View>
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
});
