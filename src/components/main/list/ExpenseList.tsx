import React from 'react';
import { StyleSheet, SectionList, View, Text } from 'react-native';
import { IEntry } from '../../../types';
import Storage from '../../../Storage';
import { eventEmitter } from '../../../Globals';
import PopUp from './PopUp';
import Entry from './Entry';
import SectionHeader from './SectionHeader';

interface ExpenseListProps {
	style?: any;
	onPress: (entry: IEntry) => void;
}

interface ExpenseListState {
	popupOpen: boolean;
	entries: IEntry[];
	refreshing: boolean;
}

export default class ExpenseList extends React.Component<
	ExpenseListProps,
	ExpenseListState
> {
	state: ExpenseListState = {
		entries: [],
		refreshing: true,
		popupOpen: false,
	};

	private getStyles = () => {
		if (this.state.popupOpen) {
			return {
				...this.props.style,
				...styles.list,
				opacity: 0.7,
			};
		} else {
			return {
				...this.props.style,
				...styles.list,
			};
		}
	};

	private onRefresh = async () => {
		this.setState({ refreshing: true });
		const entries = (await Storage.loadEntries()).reverse();
		const needsUpdate = entries.some((v, i) => {
			return Object.entries(v).some(([key, value]) => {
				if (value !== this.state.entries[i]?.[key]) return true;
				return false;
			});
		});

		if (needsUpdate || entries.length !== this.state.entries.length) {
			this.setState({ refreshing: false, entries }, () =>
				eventEmitter.emit('updateEntries')
			);
		} else
			this.setState({ refreshing: false }, () =>
				eventEmitter.emit('updateEntries')
			);
	};

	private popupOpen = () => {
		this.setState({ popupOpen: true });
	};

	private popupClose = () => {
		this.setState({ popupOpen: false });
	};

	async componentDidMount() {
		eventEmitter.addListener('listChanged', this.onRefresh);
		eventEmitter.addListener('onPopupOpen', this.popupOpen);
		eventEmitter.addListener('onPopupClose', this.popupClose);

		this.setState({
			entries: (await Storage.loadEntries()).reverse(),
			refreshing: false,
		});
	}

	componentWillUnmount() {
		eventEmitter.removeListener('listChanged', this.onRefresh);
		eventEmitter.removeListener('onPopupOpen', this.popupOpen);
		eventEmitter.removeListener('onPopupClose', this.popupClose);
	}

	render() {
		const sections = mapDateToEntries(this.state.entries);
		const data = Object.entries(sections).map(([section, { entries }]) => {
			return {
				section: section,
				data: entries,
			};
		});

		return (
			<>
				<SectionList
					style={this.getStyles()}
					sections={data}
					initialNumToRender={10}
					stickySectionHeadersEnabled={true}
					progressViewOffset={40}
					overScrollMode="never"
					refreshing={this.state.refreshing}
					onRefresh={this.onRefresh}
					keyExtractor={(item) => item.timestamp.toString()}
					ListEmptyComponent={emptyListComponent}
					ItemSeparatorComponent={() => <View style={styles.seperator} />}
					renderItem={({ item }) => createEntry(item, this.props.onPress)}
					renderSectionHeader={({ section }) => createSectionHeader(section)}
				/>
				<PopUp />
			</>
		);
	}
}

function createEntry(
	entry: IEntry,
	onPress: (entry: IEntry) => void
): JSX.Element {
	return (
		<Entry
			name={entry.name}
			price={entry.price}
			timestamp={entry.timestamp}
			onPress={() => onPress(entry)}
		/>
	);
}

function emptyListComponent(): JSX.Element {
	return (
		<View style={styles.emptyList}>
			<Text style={styles.emptyListText}>No entries found.</Text>
		</View>
	);
}

function createSectionHeader({
	section,
}: {
	section: string;
	data: IEntry[];
}): JSX.Element {
	return <SectionHeader title={section} />;
}

function mapDateToEntries(entries: IEntry[]) {
	const sections: { [key: string]: { entries: IEntry[] } } = {};

	entries.forEach((entry) => {
		const dateString = formatDate(entry.timestamp);

		if (!sections[dateString]) {
			sections[dateString] = {
				entries: [],
			};
		}

		sections[dateString].entries.push(entry);
	});

	return sections;
}

function formatDate(timestamp: number): string {
	const months_long_de = [
		'Januar',
		'Februar',
		'März',
		'April',
		'Mai',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'Dezember',
	];

	const date = new Date(timestamp);
	return `${months_long_de[date.getMonth()]} ${date.getFullYear()}`;
}

const styles = StyleSheet.create({
	seperator: {
		backgroundColor: '#666',

		height: 1,

		marginLeft: 7,
		marginRight: 7,
	},
	list: {
		backgroundColor: '#292938',
	},
	emptyList: {
		width: '100%',

		marginTop: '50%',

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyListText: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
	},
});
