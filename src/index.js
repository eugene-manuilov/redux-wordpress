import reducer from './reducer';
import * as actions from './actions';

const ReduxWordPress = {
	createReducer: reducer,
	reducer: reducer(),
	actions: actions
};

export default ReduxWordPress;
export { reducer as createReducer };
export { actions as actions };