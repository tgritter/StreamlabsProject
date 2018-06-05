import { createStackNavigator} from 'react-navigation';

import Login from '../screens/Login'
import Main from '../screens/Main'


export const MainStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: { 
      header: null,
    },
  },
  Main: {
    screen: Main,
    navigationOptions: {
      header: null,
    },
  },
});