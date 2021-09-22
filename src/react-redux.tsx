// @ts-nocheck
import { createContext, useState, useEffect, useMemo } from 'react'
import { shallowEqual, isFunc } from './utils'
export const AppContext = createContext(null)
export const store = {
  state: {
    user: { name: 'frank', age: 18 }, // 暂且进行简单的初始化
    group: { name: 'frontend' },
  },
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

export const connect = selector => Component => {
  return props => {
    const [, update] = useState({})
    selector = typeof selector === 'function' ? selector : state => ({ state })
    const data = selector(store.state)

    useEffect(
      () =>
        store.subscribe(() => {
          const newData = selector(store.state)
          if (!shallowEqual(data, newData)) {
            update({})
          }
        }),
      [data],
    )

    const dispatch = action => {
      store.setState(reducer(store.state, action))
    }
    return <Component {...props} dispatch={dispatch} {...data} />
  }
}

/**
 * 基于旧的 `state` 创建新的 `state`，如果不需要改变原有的 `state`，则返回上一次的 `state`。
 * @param state
 * @param { type: string, payload: any }
 * @returns newState
 */
const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    }
  }
  if (type === 'updateGroup') {
    return {
      ...state,
      group: payload,
    }
  }
  return state
}
