// @ts-nocheck
import { createContext, useState, useEffect, useMemo } from 'react'
import { shallowEqual } from './utils'
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

export const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  return props => {
    const [, update] = useState({})
    const dispatch = action => {
      store.setState(reducer(store.state, action))
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
