import { createStore } from 'redux';
//import Thunk from 'redux-thunk'
import rootReducers from './reducers/rootReducer'


export default createStore(rootReducers,{})
//export default createStore(rootReducers,{},compose(applyMiddleware(Thunk))) // Middleware