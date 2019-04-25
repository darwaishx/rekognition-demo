const initialState = {

}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_ANALYSIS_STATE':
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          state: action.state
        }
      };
    case 'SET_FACES':
      return {
        ...state,
        [action.id]: {
          ...(state[action.id] || {}),
          faces: action.faces
        }
      };
    case 'CLEAR_UPLOADER':
      return initialState;
    default:
      return state;
  }
}
