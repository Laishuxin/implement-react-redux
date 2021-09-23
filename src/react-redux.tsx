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
  if (state !== newState) {
    state = newState
    listeners.forEach(listener => listener(state))
  }
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

export const applyMiddleware = (...middlewares) => {
  return (reducer, initState) => {
    const store = createStore(reducer, initState)
    middlewares.reverse()
    // dispatch = store.dispatch
    middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
    return Object.assign({}, store, { dispatch })
  }
}

export function combineReducers(reducers) {
  if (typeof reducers !== 'object') {
    return reducers
  }
  // 过滤不合法的 reducers
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]
    // 只有是函数才认为是合法的 reducer
    if (isFunc(reducers[key])) {
      finalReducers[key] = reducers[key]
    }
  }

  const finalReducerKeys = Object.keys(finalReducers)
  return function combine(state, action) {
    const nextState = {}
    let hasChanged = false

    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]

      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(nextState).length
    return hasChanged ? nextState : state
  }
}
