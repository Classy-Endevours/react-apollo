import { combineReducers } from '@reduxjs/toolkit';
import helloWorldReducer from '../../components/HelloWorld/reducer';

const reducer = combineReducers({ helloWorldReducer });
export default reducer;
