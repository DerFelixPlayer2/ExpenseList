import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
	NativeEventSubscription,
	StyleSheet,
	View,
	BackHandler,
	AppState as ReactAppState,
	AppStateStatus as ReactAppStateStatus,
} from 'react-native';
import { IEntry } from './src/types';
import ExpenseList from './src/components/main/list/ExpenseList';
import TopNav from './src/components/top/TopNav';
import EntryEditor from './src/components/main/editor/EntryEditor';
import { Provider as PaperProvider } from 'react-native-paper';
import { eventEmitter } from './src/Globals';

interface AppProps {
	[key: string]: any;
}

interface AppState {
	entryEditor: IEntry | null;
	appState: ReactAppStateStatus;
}

/**
 * TODO:
 * - Add new app icon and loading screen (splash)
 * - Make autocompletion dropdown not suck
 * - Make add button have click feedback
 * - Make entries of sumdisplay dropdown fade in/out
 * - Reduce popup appear / disappear time
 *
 * OPTIONAL:
 * - Search bar
 * - Purge entries
 *
 * FIX:
 * - autocompletion dropdowns are not closable when clicking outside of them (might be fixable with the floating modal)
 * - autocompletion dropdowns have to be focused before they can be interacted with
 * - close sumdisplay dropdown on select
 *
 * MIGHT BE FIXED, REQUIRES FURTHER TESTING:
 * - Make entries persist after update of the app
 *
 * REQUEST:
 * - autocompletion dropdown should only contain prices that have existed for that name only
 *
 * NOTE:
 * - EditableText may cause problems in the furture due to the way updates are handled (state.needsUpdate)
 *
 */

export default class App extends React.PureComponent<AppProps, AppState> {
	private backHandler?: NativeEventSubscription;
	private appStateHandler?: NativeEventSubscription;

	state = {
		entryEditor: null,
		appState: ReactAppState.currentState,
	};

	private onBackPress = () => {
		if (this.state.entryEditor !== null) {
			this.setState({ entryEditor: null });
			eventEmitter.emit('entryList');
			return true;
		}
		return false;
	};

	private onAppStateChange = (state: ReactAppStateStatus) => {
		if (this.state.appState !== state) {
			eventEmitter.emit('updateEntries');
		}
		this.setState({ appState: state });
	};

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			this.onBackPress
		);
		this.appStateHandler = ReactAppState.addEventListener(
			'change',
			this.onAppStateChange
		);

		eventEmitter.addListener('entryDeleted', this.onBackPress);
	}

	componentWillUnmount() {
		this.backHandler?.remove();
		this.appStateHandler?.remove();
		eventEmitter.removeListener('entryDeleted', this.onBackPress);
	}

	render() {
		return (
			<PaperProvider>
				<View style={styles.window}>
					<View style={styles.container}>
						<TopNav style={styles.top} />
						{this.state.entryEditor !== null ? (
							<EntryEditor
								entry={this.state.entryEditor}
								style={styles.editor}
							/>
						) : (
							<ExpenseList
								style={styles.list}
								onPress={(entry) => {
									this.setState({ entryEditor: entry });
									eventEmitter.emit('leaveList');
								}}
							/>
						)}
					</View>
					<StatusBar style="auto" />
				</View>
			</PaperProvider>
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
		zIndex: 1,
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
