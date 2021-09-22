// @ts-nocheck
import { useContext, createContext, useState, useEffect } from 'react'

const store = {
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

// 将 createWrapper 改名为 connect
// 同时，优化内部代码。
const connect = Component => {
  return props => {
    const { state, setState } = store
    const [, update] = useState({})

    // 别忘了导入 useEffect
    useEffect(() => store.subscribe(() => update({})), [])

    const dispatch = action => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state} />
  }
}

const AppContext = createContext(null)
const App = () => {
  return (
    <AppContext.Provider value={store}>
      <Parent />
      <Son />
      <Grandson />
    </AppContext.Provider>
  )
}

const Parent = () => {
  console.log('Parent: ', Math.random())
  return (
    <section>
      <h3>Parent</h3>
      <User />
    </section>
  )
}

const Son = () => {
  console.log('Son: ', Math.random())
  return (
    <section>
      <h3>Son</h3>
      <UserModifier />
    </section>
  )
}

const Grandson = () => {
  console.log('Grandson: ', Math.random())
  return (
    <section>
      <h3>Grandson</h3>
    </section>
  )
}

const User = connect(({ state }) => {
  console.log('User: ', Math.random())
  return <div>user: {state.user.name}</div>
})

// 将 Wrapper 修改为 UserModifier
// 同时，将原先的 UserModifier 的代码放在 createWrapper 的参数中。
const UserModifier = connect(({ dispatch, state }) => {
  console.log('UserModifier: ', Math.random())
  const onChange = e =>
    dispatch({ type: 'updateUser', payload: { name: e.target.value } })

  return (
    <div>
      <input value={state.user.name} onChange={onChange} />
    </div>
  )
})

export default App
