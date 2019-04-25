const initialState = {
  hash: window.location.hash.replace(/^#/, '')
};

export default (state = initialState, action) => {
  if (action.type === 'UPDATE_URL') {
    return { hash: action.hash };
  }
  return state;
}
