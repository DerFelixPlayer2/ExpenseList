import * as React from 'react';
import {
	Text,
	TextInput,
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { IEntry } from '../../../types';

interface AutoCompletionTextInputProps {
	style?: any;
	hints: string[];
	shouldShowHintsOnInitialRender?: boolean;
	onChangeText: (text: string) => void;
	onSubmit?: () => void;
	hintTrigger?: boolean;
	keyboardType?: 'default' | 'numeric';
	placeholder?: string;
}

interface AutoCompletionTextInputState {
	matchingHints: string[];
	shouldShowHints: boolean;
	value: string;
}

export default class AutoCompletionTextInput extends React.Component<
	AutoCompletionTextInputProps,
	AutoCompletionTextInputState
> {
	state = {
		value: '',
		matchingHints: [],
		shouldShowHints:
			this.props.shouldShowHintsOnInitialRender ||
			this.props.hintTrigger ||
			false,
	};

	private onChangeText = (value: string) => {
		this.updateHints(value);
		this.props.onChangeText(value);
		this.setState({ value });
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

	componentDidMount() {
		this.updateHints();
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
				{(this.state.shouldShowHints || this.props.hintTrigger) &&
					this.state.matchingHints.length !== 0 && (
						<FlatList
							style={styles.list}
							data={this.state.matchingHints.map((title, i) => {
								return { title, id: i.toString() };
							})}
							renderItem={({ item }) => this.renderItem(item)}
						/>
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

		marginBottom: 15,
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
});
