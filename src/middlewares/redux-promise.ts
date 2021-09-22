// @ts-nocheck
export const reduxPromise =
  ({ dispatch }) =>
  next =>
  action => {
    if (action.payload instanceof Promise) {
      action.payload
        .then(payload => dispatch({ ...action, payload }))
        .catch(e => {
          dispatch({ ...action, payload: e, error: true })
          return Promise.reject(e)
        })
    } else {
      return next(action)
    }
  }
