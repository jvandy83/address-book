import { configureStore } from '@reduxjs/toolkit';
import contactReducer from './features/contact/contactSlice';
import addressReducer from './features/address/addressSlice';

export const store = configureStore({
	reducer: {
		contact: contactReducer,
		address: addressReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
