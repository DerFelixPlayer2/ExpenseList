import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Storage from './src/Storage';
import ExpenseList from './src/components/ExpenseList';
import SumDisplay from './src/components/SumDisplay';
import AddButton from './src/components/AddButton';
import TopNav from './src/components/TopNav';
import PopUp from './src/components/PopUp';

interface AppProps {}

interface AppState {
	popupVisible: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);
		this.state = { popupVisible: false };
	}

	shouldComponentUpdate(nextProps: AppProps, nextState: AppState) {
		if (nextState.popupVisible !== this.state.popupVisible) return true;
		return Object.entries(nextProps).some(([key, value]) => {
			return value !== this.props[key as any];
		});
	}

	render() {
		console.log('first');

		return (
			<View style={styles.window}>
				<View style={styles.container}>
					<TopNav style={styles.top} />
					<ExpenseList style={styles.list} />
					<AddButton
						style={styles.fab}
						onPress={() => {
							console.log('second');
							this.setState({ popupVisible: true });
						}}
					/>
				</View>
				<PopUp
					style={styles.popup}
					isVisible={this.state.popupVisible}
					callback={(canceled, data) => {
						console.log('third');
						if (!canceled && data) {
							Storage.saveEntry(data.name, data.price).then(() =>
								this.setState({ popupVisible: false })
							);
						} else this.setState({ popupVisible: false });
					}}
				/>
				<StatusBar style="auto" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	window: {
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

		flexBasis: '20%',
		flexGrowing: 1,
		flexShrink: 1,
	},
	list: {
		width: '100%',

		flexBasis: '100%',
		flexGrowing: 1,
		flexShrink: 1,
	},
	fab: {
		position: 'absolute',
		bottom: '10%',
		right: 0,
	},
	display: {
		width: '100%',

		flexBasis: '10%',
		flexGrowing: 1,
		flexShrink: 1,
	},
	popup: {},
});
