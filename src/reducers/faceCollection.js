const initialState = {
  faces: null
}


function uniq(arr) {
  return arr.filter((x, i) => arr.find(y => y.id === x.id) === x);
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_COLLECTION_FACES':
      return {
        ...state,
        faces: uniq([ ...(state.faces || []), ...action.faces ]),
        nextToken: action.nextToken
      };
    case 'SET_COLLECTION_LOADING':
      return {
        ...state,
        loading: action.loading
      }
    case 'SET_FACE_DELETE_CONFIRM':
      return {
        ...state,
        deletingFace: action.id
      }
    case 'CLEAR_FACE_LIST':
      return initialState
    default:
      return state;
  }
}
