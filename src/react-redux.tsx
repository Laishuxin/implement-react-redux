// @ts-nocheck
import { createContext, useState, useEffect } from 'react'
import {
  shallowEqual,
  isFunc /* 将 typeof fn === 'function' 抽离到 utils 下 */,
} from './utils'
const AppContext = createContext(null)
export const Provider = ({ store, ...restProps }) => (
  <AppContext.Provider value={store} {...restProps} />
)

let state = null
let reducer = null
const listeners = []
const setState = newState => {
  state = newState
  listeners.forEach(listener => listener(state))
}
let dispatch = action => setState(reducer(state, action))
const getState = () => state
const replaceReducer = nextReducer => (reducer = nextReducer)
const subscribe = listener => {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index >= 0) listeners.splice(index, 1)
  }
}

export const applyMiddleware = (...middlewares) => {
  return (reducer, initState) => {
    const store = createStore(reducer, initState)
    middlewares.reverse()
    // dispatch = store.dispatch
    middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
    return Object.assign({}, store, { dispatch })
  }
}

const store = {
  getState,
  subscribe,
  dispatch,
  replaceReducer,
}

export const createStore = (_reducer, initState) => {
  state = initState
  reducer = _reducer
  return store
}

export const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  return props => {
    const [, update] = useState({})

    mapStateToProps = isFunc(mapStateToProps)
      ? mapStateToProps
      : state => ({ state })
    const data = mapStateToProps(state)

    const dispatchers = isFunc(mapDispatchToProps)
      ? mapDispatchToProps(dispatch)
      : { dispatch }

    useEffect(
      () =>
        store.subscribe(() => {
          const newData = mapStateToProps(state)
          if (!shallowEqual(data, newData)) {
            update({})
          }
        }),
      [data],
    )

    return <Component {...props} {...dispatchers} {...data} />
  }
}
