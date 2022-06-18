import * as React from 'react';
import {
	Text,
	TextInput,
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { eventEmitter } from '../../../Globals';

interface AutoCompletionTextInputProps {
	style?: any;
	hints: string[];
	shouldShowHintsOnInitialRender?: boolean;
	onChangeText: (text: string) => void;
	onSubmit?: () => void;
	hintOverride?: boolean | undefined;
	keyboardType?: 'default' | 'numeric';
	placeholder?: string;
}

interface AutoCompletionTextInputState {
	matchingHints: string[];
	shouldShowHints: boolean;
	errorMessage: string;
	value: string;
}

export default class AutoCompletionTextInput extends React.Component<
	AutoCompletionTextInputProps,
	AutoCompletionTextInputState
> {
	state = {
		value: '',
		matchingHints: [],
		errorMessage: '',
		shouldShowHints:
			this.props.hintOverride === undefined
				? this.props.shouldShowHintsOnInitialRender || false
				: this.props.hintOverride,
	};

	private onChangeText = (value: string) => {
		this.updateHints(value);
		this.props.onChangeText(value);
		this.setState({ value, errorMessage: '' });
	};

	private updateHints = (newValue: string = '') => {
		const matchingHints = this.props.hints
			.filter(
				(hint) =>
					hint.toLocaleLowerCase().includes(newValue.toLocaleLowerCase()) &&
					hint.length > 0
			)
			.sort((a, b) => {
				if (isNaN(parseFloat(a)) || isNaN(parseFloat(b))) {
					return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
				}
				return parseFloat(a) - parseFloat(b);
			});
		this.setState({ matchingHints });
	};

	private getStyle = () => {
		return {
			...this.props.style,
			...styles.container,
		};
	};

	private renderItem = ({ title }: { title: string; id: string }) => {
		return (
			<TouchableOpacity
				style={styles.list_item}
				onPress={() => {
					this.onChangeText(title);
					if (this.props.onSubmit) {
						this.props.onSubmit();
					}
					this.setState({ shouldShowHints: false });
				}}>
				<Text style={styles.list_title}>{title}</Text>
			</TouchableOpacity>
		);
	};

	private onSubmitInvalidValues = () => {
		this.setState({ shouldShowHints: false });
		if (this.state.value.length === 0) {
			this.setState({
				errorMessage:
					/*'Field cannot be empty'*/ 'Feld muss einen Wert enthalten',
			});
		}
	};

	componentDidMount() {
		this.updateHints();
		eventEmitter.addListener('invalidPopupValues', this.onSubmitInvalidValues);
	}

	componentWillUnmount() {
		eventEmitter.removeListener(
			'invalidPopupValues',
			this.onSubmitInvalidValues
		);
	}

	render() {
		return (
			<View style={this.getStyle()}>
				<TextInput
					style={styles.text_input}
					value={this.state.value}
					placeholder={this.props.placeholder}
					placeholderTextColor="#ffffff99"
					keyboardType={this.props.keyboardType || 'default'}
					spellCheck={false}
					numberOfLines={1}
					autoCorrect={false}
					blurOnSubmit={true}
					onChangeText={this.onChangeText}
					onFocus={() => this.setState({ shouldShowHints: true })}
					onSubmitEditing={() => {
						this.setState({ shouldShowHints: false });
						this.props.onSubmit && this.props.onSubmit();
					}}
				/>
				{(this.props.hintOverride === undefined
					? this.state.shouldShowHints
					: this.props.hintOverride) &&
					this.state.matchingHints.length !== 0 && (
						<FlatList
							style={styles.list}
							data={this.state.matchingHints.map((title, i) => {
								return { title, id: i.toString() };
							})}
							renderItem={({ item }) => this.renderItem(item)}
						/>
					)}
				{!(this.props.hintOverride === undefined
					? this.state.shouldShowHints
					: this.props.hintOverride) &&
					this.state.matchingHints.length !== 0 &&
					this.state.errorMessage.length > 0 && (
						<>
							<View style={styles.error_placeholder} />
							<Text style={styles.text_error}>{this.state.errorMessage}</Text>
						</>
					)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {},
	text_input: {
		color: 'white',

		width: 200,

		//marginBottom: 15,
		marginTop: 5,
		paddingLeft: 10,
		paddingRight: 10,

		borderColor: '#ffffffcc',
		borderRadius: 4,
		borderWidth: 1,
	},
	list: {
		backgroundColor: '#393949',

		width: 194,
		maxHeight: 100,

		borderColor: 'black',
		borderTopColor: '#ffffff00',
		borderWidth: 1,
		borderRadius: 4,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,

		position: 'absolute',

		paddingLeft: 10,
		marginTop: 35,
		marginLeft: 3,

		zIndex: 1,
	},
	list_item: {
		padding: 4,
	},
	list_title: {
		color: 'white',
		fontSize: 15,
	},
	error_placeholder: {
		marginBottom: 14,
	},
	text_error: {
		color: '#ff4444ee',
		fontSize: 13,
		fontWeight: 'bold',

		position: 'absolute',
		top: 39,
		left: 1,
	},
});
