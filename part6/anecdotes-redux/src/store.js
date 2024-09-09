import { configureStore } from "@reduxjs/toolkit"
import anecdoteReducer from "./reducers/anecdoteReducer"
import filterReducer from "./reducers/filterReducer"
import notificationReducer from "./reducers/notificationReducer"

// state will be a combination of the anecdotes reducer and the filter one, so for all notes we want state.anecdotes and for the value of the filter state.filter
const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store
