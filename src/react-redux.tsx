// @ts-nocheck
import { createContext, useState, useEffect } from 'react'
export const AppContext = createContext(null)
export const store = {
  state: {
    user: { name: 'frank', age: 18 }, // 暂且进行简单的初始化
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

export const connect = Component => {
  return props => {
    const { state, setState } = store
    const [, update] = useState({})

    useEffect(() => store.subscribe(() => update({})), [])

    const dispatch = action => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state} />
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
  return state
}
