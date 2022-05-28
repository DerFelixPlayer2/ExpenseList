import React from 'react';
import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native';
import Storage from '../../Storage';
import { IEntry } from '../../types';
import { EventEmitter } from 'eventemitter3';

interface EntryEditorProps {
	style?: any;
	entry: IEntry;
}

interface EntryEditorState {
	name: string;
	price: string;
}

interface EditableTextProps {
	style?: any;
	value: string | string[];
	onEdit?: (newValue: string) => void;
	onDone?: () => void;
}

interface EditableTextState {
	editing: boolean;
}

const EE = new EventEmitter();

export default class EntryEditor extends React.PureComponent<
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
					EE.emit('backgroundClicked');
				}}>
				<Text style={styles.text_secondary}>Typ:</Text>
				<Text style={styles.text_primary}>
					{parseFloat(this.state.price) < 0 ? 'Einnahme' : 'Ausgabe'}
				</Text>
				<Text style={styles.text_secondary}>Name:</Text>
				<EditableText
					style={styles.text_primary}
					value={this.state.name}
					onEdit={(newValue) => {
						this.setState({ name: newValue });
					}}
					onDone={this.saveToStorage}
				/>
				<Text style={styles.text_secondary}>Preis:</Text>
				<EditableText
					style={styles.text_primary}
					value={`€ ${
						this.state.price.charAt(0) === '-'
							? this.state.price.substring(1)
							: this.state.price
					}`}
					onEdit={(newValue) => {
						this.setState({
							price: newValue.substring(2),
						});
					}}
					onDone={() => {
						this.setState({
							price: parseFloat(this.state.price).toFixed(2),
						});
						this.saveToStorage();
					}}
				/>
			</Pressable>
		);
	}
}

class EditableText extends React.PureComponent<
	EditableTextProps,
	EditableTextState
> {
	state = { editing: false };

	componentDidMount() {
		EE.on('backgroundClicked', () => {
			this.props.onDone?.call(this);
			this.setState({ editing: false });
		});
	}

	componentWillUnmount() {
		EE.removeListener('backgroundClicked');
	}

	render() {
		return (
			<View>
				{this.state.editing ? (
					<TextInput
						style={this.props.style}
						value={
							this.props.value instanceof Array
								? this.props.value.join('')
								: this.props.value
						}
						blurOnSubmit={true}
						spellCheck={true}
						autoFocus={true}
						onChangeText={(newValue: string) => {
							this.props.onEdit?.call(this, newValue);
						}}
						onSubmitEditing={(e) => {
							this.props.onDone?.call(this);
						}}
						onBlur={() => {
							this.props.onDone?.call(this);
							this.setState({ editing: false });
						}}
					/>
				) : (
					<Text
						style={this.props.style}
						onPress={() => {
							this.setState({ editing: true });
						}}>
						{this.props.value}
					</Text>
				)}
			</View>
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
});
