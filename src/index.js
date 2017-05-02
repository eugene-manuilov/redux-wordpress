import reducer from './reducer';
import actions from './actions';
import requests from './requests';

const ReduxWordPress = {
	createReducer: reducer,
	createActions: actions,
	createRequests: requests,
};

export default ReduxWordPress;
export { reducer as createReducer };
export { actions as createActions };
export { requests as createRequests };
