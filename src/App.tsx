// @ts-nocheck
import { Provider, connect, applyMiddleware } from './react-redux'
import { connectToUser } from './connectors/connect-to-user'
import { reduxThunk } from './middlewares/redux-thunk'
import { reduxPromise } from './middlewares/redux-promise'

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

// const store = createStore(reducer, initState)
const store = applyMiddleware(reduxThunk, reduxPromise)(reducer, initState)

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

const fetchData = url => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: { name: '1s 后返回的结果' } })
      // reject({ name: 'error...' })
    }, 1000)
  })
}

const fetchUser = () =>
  fetchData('/user')
    .then(response => response.data)
    .catch({ name: 'unknown' })
const UserModifier = connect()(({ state, dispatch }) => {
  console.log('UserModifier: ', Math.random())

  const handleClick = () => {
    dispatch({
      type: 'updateUser',
      payload: fetchUser(),
    })
  }

  return (
    <div>
      <div>user: {state.user.name}</div>
      <button onClick={handleClick}>异步获取 user</button>
    </div>
  )
})

export default App
