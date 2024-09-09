import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ""
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const setTimeMessage = (message, time) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    window.notificationTimeout = setTimeout(() => {dispatch(clearNotification())}, time)
  }
}

export default notificationSlice.reducer
