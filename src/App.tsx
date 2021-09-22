// @ts-nocheck
import { useState, useContext, createContext } from 'react'

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

const AppContext = createContext(null)
const App = () => {
  const [appState, setAppState] = useState({
    user: { name: 'frank', age: 18 },
  })

  const contextValue = { appState, setAppState }
  return (
    <AppContext.Provider value={contextValue}>
      <Parent />
      <Son />
      <Grandson />
    </AppContext.Provider>
  )
}

const Parent = () => (
  <section>
    <h3>Parent</h3>
    <User />
  </section>
)

const Son = () => (
  <section>
    <h3>Son</h3>
    <Wrapper />
  </section>
)

const Grandson = () => (
  <section>
    <h3>Grandson</h3>
  </section>
)

const User = () => {
  const contextValue = useContext(AppContext)
  return <div>user: {contextValue.appState.user.name}</div>
}

const Wrapper = () => {
  const { appState, setAppState } = useContext(AppContext)
  const dispatch = action => {
    setAppState(reducer(appState, action))
  }
  return <UserModifier dispatch={dispatch} state={appState} />
}

const UserModifier = ({ dispatch, state }) => {
  const onChange = e =>
    dispatch({ type: 'updateUser', payload: { name: e.target.value } })

  return (
    <div>
      <input value={state.user.name} onChange={onChange} />
    </div>
  )
}

export default App
