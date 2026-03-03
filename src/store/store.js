import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'app',
  initialState: {
    page: {
        title: null,
        link: null
    },
    isMenuShowing: false,
  },
  reducers: {
    changePage: (state,action) => {
      state.page = action.payload
    },
    updateMenuState: (state,action) => {
      state.isMenuShowing = action.payload
    },
    toggleMenuState: (state) => {
      state.isMenuShowing = !(state.isMenuShowing)
    },
  }
})

export const { changePage, updateMenuState, toggleMenuState } = counterSlice.actions

export const store = configureStore({
  reducer: counterSlice.reducer
})