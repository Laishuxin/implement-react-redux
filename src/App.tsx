// @ts-nocheck
import { AppContext, connect, store } from './react-redux'

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
