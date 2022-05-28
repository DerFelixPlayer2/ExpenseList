import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { eventEmitter } from '../../../Globals';

interface EditableTextProps {
	style?: any;
	children: string | string[];
	onDone?: (newValue: string) => void;
	keyboardType?: 'default' | 'numeric';
}

interface EditableTextState {
	editing: boolean;
	value: string;
}

export default class EditableText extends React.PureComponent<
	EditableTextProps,
	EditableTextState
> {
	constructor(props: EditableTextProps) {
		super(props);
		this.state = {
			editing: false,
			value:
				props.children instanceof Array
					? props.children.join('')
					: props.children,
		};
	}

	private onDone = () => {
		if (this.props.onDone) {
			this.props.onDone(this.state.value);
		}
		this.setState({ editing: false });
	};

	private onBackgroundClick = () => {
		if (this.state.editing) {
			this.onDone();
		}
	};

	componentDidUpdate(prevProps: EditableTextProps) {
		if (prevProps.children !== this.props.children) {
			this.setState({
				value:
					this.props.children instanceof Array
						? this.props.children.join('')
						: this.props.children,
			});
		}
	}

	componentDidMount() {
		eventEmitter.on('backgroundClicked', this.onBackgroundClick);
	}

	componentWillUnmount() {
		eventEmitter.removeListener('backgroundClicked', this.onBackgroundClick);
	}

	render() {
		return (
			<View>
				{this.state.editing ? (
					<TextInput
						style={this.props.style}
						keyboardType={this.props.keyboardType || 'default'}
						value={this.state.value}
						blurOnSubmit={true}
						autoFocus={true}
						onChangeText={(newValue: string) => {
							this.setState({ value: newValue });
						}}
						onBlur={this.onDone}
					/>
				) : (
					<Text
						style={this.props.style}
						onPress={() => {
							this.setState({ editing: true });
						}}>
						{this.state.value}
					</Text>
				)}
			</View>
		);
	}
}
