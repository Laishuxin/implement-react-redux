// @ts-nocheck
import { Provider, connect, createStore } from './react-redux'
import { connectToUser } from './connectors/connect-to-user'

const initState = {
  user: { name: 'frank', age: 18 },
  group: { name: 'frontend' },
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

const store = createStore(reducer, initState)

const App = () => {
  return (
    <Provider value={store}>
      <Parent />
      <Son />
      <Grandson />
    </Provider>
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
