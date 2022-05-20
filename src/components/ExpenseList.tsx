import React, { Fragment } from 'react';
import { Text, StyleSheet, SectionList } from 'react-native';
import { IEntry } from '../types';
import Storage from '../Storage';
import { ActivityIndicator } from 'react-native';

interface ExpenseListState {
	entries?: IEntry[];
}

export default class ExpenseList extends React.Component<{}, ExpenseListState> {
	componentDidMount() {
		this.setState({
			entries: Storage.loadEntries(),
		});
	}

	render() {
		if (!this.state?.entries) {
			return <ActivityIndicator size="large" />;
		}

		//const entries = this.state.entries.map(createEntry);
		const sections = mapDateToEntries(this.state.entries);
		const data = Object.entries(sections).map(([section, { entries }]) => {
			return {
				title: section,
				data: entries,
			};
		});

		return (
			<SectionList
				style={styles.list}
				sections={data}
				keyExtractor={(item, idx) => item.id.toString() + idx}
				renderItem={({ item }) => createEntry(item)}
				renderSectionHeader={({ section: { title } }) => (
					<Text style={styles.header}>{title}</Text>
				)}
			/>
		);
	}
}

// TODO
function createEntry(entry: IEntry): JSX.Element {
	return (
		<Fragment>
			<Text>{entry.name}</Text>
			<Text>€ {entry.price}</Text>
		</Fragment>
	);
}

function mapDateToEntries(entries: IEntry[]) {
	const sections: { [key: string]: { entries: IEntry[] } } = {};

	entries.forEach((entry) => {
		const date = new Date(entry.timestamp);
		const dateString = date.toLocaleDateString();

		if (!sections[dateString]) {
			sections[dateString] = {
				entries: [],
			};
		}

		sections[dateString].entries.push(entry);
	});

	return sections;
}

// TODO
const styles = StyleSheet.create({
	header: {
		fontSize: 20,
	},
	list: {
		marginTop: '10%',
	},
});
