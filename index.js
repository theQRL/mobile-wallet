import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('theQRL', () => App);
