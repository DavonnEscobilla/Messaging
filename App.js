import { StyleSheet, Text, View } from 'react-native';
import Status from './components/Status';

export default function App() {
  return (
    <View style={styles.container}>
      <Status />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  androidStatusBar: { 
    barStyle: "dark-content", 
    backgroundColor: "#FFFFFF" 
  },
});