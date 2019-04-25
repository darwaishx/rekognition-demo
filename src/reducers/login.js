const initialState = {
  state: 'LOADING',
  readOnly: true,
  error: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_LOGIN_STATE':
      return {
        ...state,
        state: action.state
      }
    case 'SET_READ_ONLY':
      return {
        ...state,
        readOnly: action.readOnly
      }
    case 'SET_LOGIN_ERROR':
      return {
        ...state,
        error: action.message
      }
    default:
      return state;
  }
}
