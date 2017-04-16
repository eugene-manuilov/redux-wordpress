import reducer from './reducer';
import actions from './actions';

const ReduxWordPress = {
	createReducer: reducer,
	createActions: actions
};

export default ReduxWordPress;
export { reducer as createReducer };
export { actions as createActions };