// @ts-nocheck
import { connect } from '../react-redux'

const userSelector = state => ({ user: state.user })
const userDispatchers = dispatch => ({
  updateUser: payload => dispatch({ type: 'updateUser', payload }),
})
export const connectToUser = connect(userSelector, userDispatchers)
