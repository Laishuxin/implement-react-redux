// @ts-nocheck
export const reduxThunk = ({ dispatch, getState }) => {
  return next => action =>
    typeof action === 'function' ? action(dispatch, getState) : next(action)
}
