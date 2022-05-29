import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
	NativeEventSubscription,
	StyleSheet,
	View,
	BackHandler,
} from 'react-native';
import { IEntry } from './src/types';
import Storage from './src/Storage';
import ExpenseList from './src/components/main/list/ExpenseList';
import TopNav from './src/components/top/TopNav';
import PopUp from './src/components/main/PopUp';
import EntryEditor from './src/components/main/editor/EntryEditor';
import { eventEmitter } from './src/Globals';

interface AppProps {
	[key: string]: any;
}

interface AppState {
	popupVisible: boolean;
	entryEditor: IEntry | null;
}

/** TODOs:
 * - Rework add entry menu (PopUp)
 *   - Shortcuts
 * - Entry editor / detailed view
 * 	- Make different design for income and expense
 * - Search bar
 *
 * FIX:
 * - Fix wonky behavior when adding new entry (using values of last created element when no value is provided)
 * - entries randomly duplicating (????)
 *
 */

export default class App extends React.PureComponent<AppProps, AppState> {
	private backHandler?: NativeEventSubscription;

	constructor(props: AppProps) {
		super(props);
		this.state = { popupVisible: false, entryEditor: null };
	}

	private onBackPress = () => {
		if (this.state.entryEditor !== null) {
			this.setState({ entryEditor: null });
			return true;
		}
		return false;
	};

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			this.onBackPress
		);

		eventEmitter.addListener('entryDeleted', this.onBackPress);
	}

	componentWillUnmount() {
		this.backHandler?.remove();
		eventEmitter.removeListener('entryDeleted', this.onBackPress);
	}

	render() {
		return (
			<View style={styles.window}>
				<View style={styles.container}>
					<TopNav
						style={styles.top}
						onAddButtonPress={() => {
							this.setState({ popupVisible: true });
						}}
					/>
					{this.state.entryEditor !== null ? (
						<EntryEditor entry={this.state.entryEditor} style={styles.editor} />
					) : (
						<ExpenseList
							style={styles.list}
							onPress={(entry) => {
								this.setState({ entryEditor: entry });
							}}
						/>
					)}
				</View>
				<PopUp
					isVisible={this.state.popupVisible}
					onRequestClose={() => this.setState({ popupVisible: false })}
					callback={async (canceled, data) => {
						if (!canceled && data) {
							await Storage.saveEntry(data.name, data.price);
						}
						this.setState({ popupVisible: false });
					}}
				/>
				<StatusBar style="auto" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	window: {
		backgroundColor: 'black',

		height: '100%',
		width: '100%',
	},
	container: {
		height: '100%',
		width: '100%',

		display: 'flex',
		flexDirection: 'column',
	},
	top: {
		width: '100%',

		flexBasis: '15%',
		flexGrowing: 1,
		flexShrink: 1,
	},
	list: {
		width: '100%',

		flexBasis: '85%',
		flexGrowing: 1,
		flexShrink: 1,
	},
	editor: {
		width: '100%',

		flexBasis: '85%',
		flexGrowing: 1,
		flexShrink: 1,
	},
});
