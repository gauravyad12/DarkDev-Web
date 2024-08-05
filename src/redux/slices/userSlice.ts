import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import { auth, createUserProfileDocument } from '@/api/firebase';

interface UserState {
  userId: string | null;
  loading: boolean;
}

const initialState: UserState = {
  userId: null,
  loading: true,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.userId = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = user.actions;

export const getUser = (): AppThunk => async (dispatch) => {
  onAuthStateChanged(auth, async (userAuth) => {
    if (userAuth) {
      const userRef = await createUserProfileDocument(userAuth);
      onSnapshot(userRef, (snapShot) => dispatch(setUser(snapShot.id)));
    } else {
      dispatch(clearUser());
    }
  });
};

export default user.reducer;
