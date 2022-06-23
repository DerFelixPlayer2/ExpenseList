import React, { createRef, useRef } from 'react';
import Storage from '../../Storage';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	Pressable,
	Animated,
	TouchableOpacity,
	Easing,
	InteractionManager,
} from 'react-native';
import { eventEmitter, MS_7_DAYS, MS_30_DAYS } from '../../Globals';
import Settings from '../../Settings';
import { ModalFloating } from '../FloatingModal';

type displayOptions_internal =
	| 'thisWeek'
	| 'thisMonth'
	| 'last7d'
	| 'last30d'
	| 'all';

type displayOptions_user =
	| 'Diese Woche'
	| 'Dieser Monat'
	| 'Letzte 7 Tage'
	| 'Letzte 30 Tage'
	| 'Alles';

interface SumDisplayProps {
	style?: any;
}

interface SumDisplayState {
	values: {
		thisWeek: number;
		thisMonth: number;
		last7d: number;
		last30d: number;
		all: number;
	} | null;
	selected: displayOptions_internal;
	animValue: Animated.Value;
	modalVisible: boolean;
	listHeight: number;
}

export default class SumDisplay extends React.Component<
	SumDisplayProps,
	SumDisplayState
> {
	private typeMap = {
		'Diese Woche': 'thisWeek' as const,
		'Dieser Monat': 'thisMonth' as const,
		'Letzte 7 Tage': 'last7d' as const,
		'Letzte 30 Tage': 'last30d' as const,
		Alles: 'all' as const,
	};
	state = {
		values: null,
		selected: 'all' as displayOptions_internal,
		listOpen: false,
		animValue: new Animated.Value(0),
		modalVisible: false,
		listHeight: 0,
	};

	private getStyle = () => {
		return {
			...this.props.style,
			...styles.container,
		};
	};

	private onListChange = async () => {
		const entries = await (await Storage.getInstance()).loadEntries();

		const firstOfMonth = new Date();
		firstOfMonth.setUTCFullYear(new Date().getUTCFullYear());
		firstOfMonth.setUTCMonth(new Date().getUTCMonth());
		firstOfMonth.setUTCDate(1);
		firstOfMonth.setUTCHours(0, 0, 0, 0);
		const lastMonday = new Date();
		if (lastMonday.getUTCDay() !== 1) {
			lastMonday.setUTCDate(
				lastMonday.getUTCDate() - lastMonday.getUTCDay() - 6
			);
		}
		lastMonday.setUTCHours(0, 0, 0, 0);

		this.setState({
			values: {
				thisWeek: entries
					.filter((e) => e.timestamp >= lastMonday.valueOf())
					.reduce((acc, e) => acc + e.price, 0),
				thisMonth: entries
					.filter((e) => e.timestamp >= firstOfMonth.valueOf())
					.reduce((acc, e) => acc + e.price, 0),
				last7d: entries
					.filter((e) => e.timestamp >= Date.now() - MS_7_DAYS)
					.reduce((acc, e) => acc + e.price, 0),
				last30d: entries
					.filter((e) => e.timestamp >= Date.now() - MS_30_DAYS)
					.reduce((acc, e) => acc + e.price, 0),
				all: entries.reduce((acc, e) => acc + e.price, 0),
			},
		});
	};

	private onSelect = (type: displayOptions_user) => {
		this.setState({
			selected: this.typeMap[type],
		});
		InteractionManager.runAfterInteractions(() =>
			Settings.getInstance().set('displayType', this.typeMap[type])
		);
	};

	private renderListItem = ({
		title,
	}: {
		id: number;
		title: displayOptions_user;
	}) => {
		const highlight = this.state.selected === this.typeMap[title];
		const _style = highlight
			? { ...styles.list_item, ...styles.list_item_selected }
			: styles.list_item;
		return (
			<TouchableOpacity
				activeOpacity={0.3}
				onPress={() => {
					this.onSelect(title);
				}}>
				<Text
					style={{
						..._style,
					}}>
					{title}
				</Text>
			</TouchableOpacity>
		);
	};

	private animateOpen = (callback?: () => void) => {
		console.log('open');
		Animated.timing(this.state.animValue, {
			useNativeDriver: true,
			toValue: 1,
			duration: 500,
			easing: Easing.inOut(Easing.cubic),
		}).start(callback);
	};

	private animateClose = (callback?: () => void) => {
		console.log('close');
		Animated.timing(this.state.animValue, {
			useNativeDriver: true,
			toValue: 0,
			duration: 500,
			easing: Easing.inOut(Easing.cubic),
		}).start(callback);
	};

	async componentDidMount() {
		eventEmitter.addListener('listChanged', this.onListChange);
		this.onListChange();

		let type = (await Settings.getInstance().get('string', 'displayType')) as
			| displayOptions_internal
			| null
			| undefined;
		type = type && Object.values(this.typeMap).includes(type) ? type : 'all';
		this.setState({
			selected: type as displayOptions_internal,
		});
	}

	componentWillUnmount() {
		eventEmitter.removeListener('listChanged', this.onListChange);
	}

	render() {
		if (this.state.values === null) {
			return (
				<View style={this.getStyle()}>
					<ActivityIndicator />
				</View>
			);
		}

		return (
			<View style={this.getStyle()}>
				<Pressable
					onPress={() => {
						this.setState({ modalVisible: true });
						this.animateOpen();
					}}>
					<View style={styles.text_wrapper}>
						<Text style={styles.text}>
							€ {(this.state.values[this.state.selected] as number).toFixed(2)}
						</Text>
						<Animated.Image
							source={require('../../../assets/16_dropdown_arrow.png')}
							fadeDuration={0}
							style={{
								...styles.image,
								transform: [
									{
										rotateZ: this.state.animValue.interpolate({
											inputRange: [0, 1],
											outputRange: ['0deg', '540deg'],
										}),
									},
								],
							}}
						/>
					</View>
				</Pressable>

				<ModalFloating
					visible={this.state.modalVisible}
					onBlur={() => {
						this.animateClose(() => this.setState({ modalVisible: false }));
					}}>
					<Animated.FlatList
						onLayout={(e) => {
							this.setState({
								listHeight: e.nativeEvent.layout.height,
							});
						}}
						style={{
							...styles.list,
							top:
								(styles.list?.top ? styles.list.top : 0) -
								this.state.listHeight / 2,
							transform: [
								{ scaleY: this.state.animValue },
								{ translateY: this.state.listHeight / 2 },
							],
							opacity: this.state.listHeight === 0 ? 0 : 1,
						}}
						data={Object.entries(this.typeMap).map((v, i) => {
							return { id: i, title: v[0] as displayOptions_user };
						})}
						renderItem={({ item }) => this.renderListItem(item)}
					/>
				</ModalFloating>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {},
	text: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
	},
	text_wrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		marginLeft: 10,
	},
	list: {
		backgroundColor: '#cf4a1d',

		position: 'absolute',
		top: 109,
		left: 30,

		padding: 14,
		paddingTop: 0,
		paddingBottom: 5,

		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,

		borderColor: 'black',
		borderWidth: 1,
		borderTopWidth: 0,
		borderRadius: 12,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
	list_item: {
		color: '#fff',
		fontSize: 17,
		fontWeight: '500',
		marginBottom: 3,
	},
	list_item_selected: { opacity: 0.7 },
});
