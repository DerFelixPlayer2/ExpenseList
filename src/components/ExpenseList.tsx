import React from 'react';
import { StyleSheet, SectionList, View, Text } from 'react-native';
import { IEntry } from '../types';
import Storage from '../Storage';
import { ActivityIndicator } from 'react-native';
import Entry from './Entry';
import SectionHeader from './SectionHeader';

interface ExpenseListProps {
	[key: string]: any;
	style?: any;
}

interface ExpenseListState {
	entries: IEntry[];
	refreshing: boolean;
	style: any;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default class ExpenseList extends React.Component<
	ExpenseListProps,
	ExpenseListState
> {
	refreshing = false;

	constructor(props: ExpenseListProps) {
		super(props);

		this.state = {
			entries: [],
			refreshing: true,
			style: this.props.style,
		};

		this.getStyles = this.getStyles.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
	}

	async componentDidMount() {
		this.setState({
			entries: (await Storage.loadEntries()).reverse(),
			refreshing: false,
		});
	}

	shouldComponentUpdate(
		nextProps: ExpenseListProps,
		nextState: ExpenseListState
	) {
		Storage.loadEntries()
			.then((entries) => entries.reverse())
			.then((entries) => {
				const needsUpdate = entries.some((v, i) => {
					return Object.entries(v).some(([key, value]) => {
						if (value !== this.state.entries[i]?.[key as any]) return true;
						return false;
					});
				});

				if (needsUpdate || entries.length !== this.state.entries.length) {
					this.setState({ entries });
				}
			})
			.catch(console.error); // TODO: error handling (error loading content) or just keep old data(?)

		if (
			nextState.refreshing !== this.state.refreshing ||
			JSON.stringify(nextState.entries) !== JSON.stringify(this.state.entries)
		)
			return true;
		return Object.entries(nextProps).some(([key, value]) => {
			return value !== this.props[key as any];
		});
	}

	private getStyles() {
		return {
			...styles.list,
			...this.state.style,
		};
	}

	async onRefresh() {
		this.setState({ refreshing: true });
		const entries = await Storage.loadEntries();
		const needsUpdate = entries.some((v, i) => {
			return Object.entries(v).some(([key, value]) => {
				if (value !== this.state.entries[i]?.[key as any]) return true;
				return false;
			});
		});

		if (needsUpdate || entries.length !== this.state.entries.length) {
			this.setState({ refreshing: false, entries });
		} else this.setState({ refreshing: false });
	}

	render() {
		if (this.state.entries.length === 0 && this.state.refreshing) {
			return <ActivityIndicator size="large" style={this.getStyles()} />;
		}

		const sections = mapDateToEntries(this.state.entries);
		const data = Object.entries(sections).map(([section, { entries }]) => {
			return {
				section: section,
				data: entries,
			};
		});

		return (
			<View style={this.getStyles()}>
				<SectionList
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
					renderItem={({ item }) => createEntry(item)}
					renderSectionHeader={({ section }) => createSectionHeader(section)}
				/>
			</View>
		);
	}
}

function createEntry(entry: IEntry): JSX.Element {
	return (
		<Entry name={entry.name} price={entry.price} timestamp={entry.timestamp} />
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
		const date = new Date(entry.timestamp);
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
		backgroundColor: '#282830',
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
