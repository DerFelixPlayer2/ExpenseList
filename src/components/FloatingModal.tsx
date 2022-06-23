import React from 'react';
import {
	Dimensions,
	View,
	TouchableWithoutFeedback,
	StyleSheet,
} from 'react-native';
import { Portal } from 'react-native-paper';

export const ModalFloating = ({
	children,
	visible,
	onBlur = () => {},
}: {
	children: React.ReactNode;
	visible: boolean;
	onBlur: () => void;
}) => {
	if (!visible) return null;

	const { width, height } = Dimensions.get('window');
	return (
		<Portal>
			<View style={[styles.wrapper, { width, height }]}>
				<>
					<TouchableWithoutFeedback onPress={onBlur} onLongPress={() => {}}>
						<View
							style={{ width, height, position: 'absolute', left: 0, top: 0 }}
						/>
					</TouchableWithoutFeedback>
					{children}
				</>
			</View>
		</Portal>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		left: 0,
		top: 0,
		position: 'absolute',
		zIndex: -10,
	},
});
