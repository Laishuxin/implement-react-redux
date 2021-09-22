// @ts-nocheck
export const reduxThunk = ({ dispatch, getState }) => {
  return next => action => {
    return typeof action === 'function'
      ? action(dispatch, getState)
      : next(action)
  }
}
