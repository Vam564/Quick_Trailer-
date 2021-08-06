import { combineReducers } from 'redux';
import ListPageReducer from './ListPageReducer'
import DetailPageReducer from './DetailPageReducer'
import CricketScoreReducer from './CricketScoreReducer'

const rootReducers = combineReducers({ListPageReducer, DetailPageReducer, CricketScoreReducer})
export default rootReducers;
