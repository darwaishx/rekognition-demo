const initialState = {

}

function key(action) {
  return `${action.imageId}::${action.faceIndex}`;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SELECT_FACE':
      return {
        ...state,
        [key(action)]: {
          ...(state[key(action)] || {}),
          selected: true
        }
      }
    case 'DESELECT_FACE':
      return {
        ...state,
        [key(action)]: {
          ...(state[key(action)] || {}),
          selected: false
        }
      }
    case 'SET_UPLOADER_FACE_NAME':
      return {
        ...state,
        [key(action)]: {
          ...(state[key(action)] || {}),
          name: action.name
        }
      }
    case 'SET_UPLOADER_STATE':
      return {
        ...state,
        state: action.state
      }
    case 'CLEAR_UPLOADER':
      return initialState;
    default:
      return state;
  }
}
