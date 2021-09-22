// @ts-nocheck
import { AppContext, connect, store } from './react-redux'
import { connectToUser } from './connectors/connect-to-user'

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

const Grandson = connect(state => ({ group: state.group }))(
  ({ group, dispatch }) => {
    console.log('Grandson: ', Math.random())
    const onChange = e => {
      dispatch({ type: 'updateGroup', payload: { name: e.target.value } })
    }
    return (
      <section>
        <h3>Grandson</h3>
        <div>group: {group.name}</div>
        <input type='text' value={group.name} onChange={onChange} />
      </section>
    )
  },
)

const User = connectToUser(({ user }) => {
  console.log('User: ', Math.random())
  return <div>user: {user.name}</div>
})

const UserModifier = connectToUser(({ updateUser, user }) => {
  console.log('UserModifier: ', Math.random())
  const onChange = e => updateUser({ name: e.target.value })

  return (
    <div>
      <input value={user.name} onChange={onChange} />
    </div>
  )
})

export default App
