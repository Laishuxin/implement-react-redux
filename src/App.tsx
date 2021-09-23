// @ts-nocheck
import {
  Provider,
  connect,
  applyMiddleware,
  combineReducers,
} from './react-redux'
import { reduxThunk } from './middlewares/redux-thunk'
import { reduxPromise } from './middlewares/redux-promise'

const initState = {
  count: 0,
  todos: ['old todo'],
}

const countReducer = (state, { type }) => {
  switch (type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
  }
  return state
}

const todosReducer = (state, { type, payload }) => {
  switch (type) {
    case 'ADD_TODO':
      return [...state, payload]
  }
  return state
}

const allReducers = combineReducers({
  count: countReducer,
  todos: todosReducer,
})

// const store = createStore(reducer, initState)
const store = applyMiddleware(reduxThunk, reduxPromise)(allReducers, initState)

const App = () => {
  return (
    <Provider value={store}>
      <Counter />
      <Todos />
    </Provider>
  )
}

const Counter = connect(state => ({
  count: state.count,
}))(({ count, dispatch }) => {
  console.log(`count: ${count}`)
  const handleIncrement = () => dispatch({ type: 'INCREMENT' })
  const handleDecrement = () => dispatch({ type: 'DECREMENT' })

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={handleIncrement}>increment</button>
      <button onClick={handleDecrement}>decrement</button>
    </div>
  )
})

// 用来标识，别无它意
let id = 0
const Todos = connect(state => ({ todos: state.todos }))(
  ({ todos, dispatch }) => {
    console.log(`todos: ${todos}`)
    const handleAddTodo = () =>
      dispatch({ type: 'ADD_TODO', payload: `new todo ${id++}` })

    return (
      <div>
        <p>todos: {JSON.stringify(todos)}</p>
        <button onClick={handleAddTodo}>add todo</button>
      </div>
    )
  },
)

export default App
