// @ts-nocheck
import { createContext, useState, useEffect } from 'react'
import { shallowEqual } from './utils'
const AppContext = createContext(null)
export const Provider = ({ store, ...restProps }) => {
  return <AppContext.Provider value={store} {...restProps} />
}

const store = {
  state: null,
  reducer: null,
  setState(newState) {
    store.state = newState
    store.listeners.forEach(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      if (index >= 0) store.listeners.splice(index, 1)
    }
  },
}

export const createStore = (reducer, initState) => {
  store.state = initState
  store.reducer = reducer
  return store
}

export const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  return props => {
    const [, update] = useState({})
    const dispatch = action => {
      store.setState(store.reducer(store.state, action))
    }

    mapStateToProps =
      typeof mapStateToProps === 'function'
        ? mapStateToProps
        : state => ({ state })
    const data = mapStateToProps(store.state)

    const dispatchers =
      typeof mapDispatchToProps === 'function'
        ? mapDispatchToProps(dispatch)
        : { dispatch }

    useEffect(
      () =>
        store.subscribe(() => {
          const newData = mapStateToProps(store.state)
          if (!shallowEqual(data, newData)) {
            update({})
          }
        }),
      [data],
    )

    return <Component {...props} {...dispatchers} {...data} />
  }
}
