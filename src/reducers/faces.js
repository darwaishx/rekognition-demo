const initialState = {

};

function key(action) {
  return `${action.id}::${action.faceIndex}`;
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_FACE_STATE':
      return {
        ...state,
        [key(action)]: {
          ...(state[key(action)] || {}),
          state: action.state
        }
      }
    case 'SET_FACE_THUMBNAIL':
      return {
        ...state,
        [key(action)]: {
          ...(state[key(action)] || {}),
          thumbnail: action.thumb
        }
      }
    case 'RECEIVE_FACE_DETAILS':
      return {
        ...state,
        [key(action)]: {
          ...(state[key(action)] || {}),
          details: {
            ...((state[key(action)] || {}).details),
            ...action.face
          }
        }
      }
    default:
      return state;
  }
}
