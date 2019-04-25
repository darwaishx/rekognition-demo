const initialState = {

}

export default function(state = initialState, action) {
  switch(action.type) {
    case 'SET_SEARCH_IMAGE':
      return {
        ...state,
        image: action.image,
        imageData: null,
        shadowData: null,
        faces: null,
        selectedFace: null,
        matchThreshold: 90
      }
    case 'SET_SEARCH_IMAGE_DATA':
      return {
        ...state,
        imageData: action.data
      }
    case 'SET_SEARCH_IMAGE_SHADOW':
      return {
        ...state,
        shadowData: action.img
      }
    case 'SET_SEARCH_STATE':
      return {
        ...state,
        state: action.state
      }
    case 'SET_SEARCH_FACES':
      return {
        ...state,
        faces: action.faces,
        selectedFace: action.faces.length === 1 ? 0 : null
      }
    case 'SET_SELECTED_FACE':
      return {
        ...state,
        selectedFace: action.index
      };
    case 'SET_SEARCH_MATCH_THRESHOLD':
      return {
        ...state,
        matchThreshold: action.value
      };
    case 'SET_SEARCH_MATCHES':
      return {
        ...state,
        faces: state.faces.map((f, idx) => {
          if (idx !== action.index) return f;
          return {
            ...f,
            matches: action.matches
          }
        })
      }
    case 'CLEAR_SEARCHER':
      return initialState;
    default:
      return state;
  }
}
