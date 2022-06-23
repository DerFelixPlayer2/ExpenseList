import React from 'react';
import {
	Dimensions,
	View,
	TouchableWithoutFeedback,
	StyleSheet,
	LayoutChangeEvent,
	StyleProp,
	ViewStyle,
} from 'react-native';
import { Portal } from 'react-native-paper';

export const ModalFloating = ({
	children,
	visible,
	style,
	onBlur,
	onLayout,
}: {
	children: React.ReactNode;
	visible: boolean;
	style?: StyleProp<ViewStyle>;
	onBlur: () => void;
	onLayout?: (e: LayoutChangeEvent) => void;
}) => {
	if (!visible) return null;

	const { width, height } = Dimensions.get('window');
	return (
		<Portal>
			<View style={[style, styles.wrapper, { width, height }]}>
				<>
					<TouchableWithoutFeedback
						onPress={onBlur}
						onLayout={onLayout}
						onLongPress={() => {}}>
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
