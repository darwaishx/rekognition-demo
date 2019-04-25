const initialState = {

};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_UPLOAD':
      return {
        ...state,
        [action.id]: {
          file: action.image
        }
      };
    case 'SET_UPLOAD_STATE':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          state: action.state,
          progress: action.progress
        }
      }
    case 'CLEAR_UPLOADER':
      return initialState;
    default:
      return state;
  }
}
