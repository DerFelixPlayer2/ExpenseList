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
import * as NavigationBar from 'expo-navigation-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { eventEmitter } from './src/Globals';

interface AppProps {
	[key: string]: any;
}

interface AppState {
	entryEditor: IEntry | null;
	appState: ReactAppStateStatus;
}

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
		NavigationBar.setBackgroundColorAsync('#cf4a1d');
		eventEmitter.addListener('entryDeleted', this.onBackPress);
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			this.onBackPress
		);
		this.appStateHandler = ReactAppState.addEventListener(
			'change',
			this.onAppStateChange
		);
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
