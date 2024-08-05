import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { getTitle } from '@/api/tmdb';
import { checkTitleFB, addTitleFB, deleteTitleFB } from '@/api/firebase';
import { TitleInfo, Cast, Video, Title } from '@/types/tmdb';

interface TitleState {
  title: TitleInfo;
  cast: Cast[];
  videos: Video[];
  loading: boolean;
  error: string | null;
  poster: boolean;
  backdrop: boolean;
  firebaseId: string;
  [key: string]: TitleState[keyof TitleState];
}

const initialState: TitleState = {
  title: {
    title: '',
    name: '',
    backdrop_path: '',
    poster_path: '',
    overview: '',
    vote_average: 0,
  },
  cast: [],
  videos: [],
  loading: false,
  error: null,
  poster: false,
  backdrop: false,
  firebaseId: '',
};

const title = createSlice({
  name: 'title',
  initialState,
  reducers: {
    getTitleStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTitleSuccess: (state, action: PayloadAction<Title>) => {
      state.title = action.payload.title;
      state.cast = action.payload.cast;
      state.videos = action.payload.results;
      state.loading = false;
    },
    getTitleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setLoaded: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    setFirebaseId: (state, action: PayloadAction<string>) => {
      state.firebaseId = action.payload;
    },
    resetTitle: () => initialState,
  },
});

export const {
  getTitleStart,
  getTitleSuccess,
  getTitleFailure,
  setLoaded,
  setFirebaseId,
  resetTitle,
} = title.actions;

export const fetchTitle =
  (mediaType: string, titleId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(getTitleStart());
      const res = await getTitle(mediaType, titleId);
      dispatch(getTitleSuccess(res));
    } catch (error) {
      dispatch(getTitleFailure(error.toString()));
    }
  };

export const checkTitle =
  (userId: string, id: string, mediaType: string): AppThunk =>
  async (dispatch) => {
    try {
      const firebaseId = await checkTitleFB(userId, id, mediaType);
      if (firebaseId) dispatch(setFirebaseId(firebaseId));
    } catch (error) {
      console.error(error);
    }
  };

export const toggle =
  (
    userId: string,
    id: string,
    mediaType: string,
    posterPath: string,
    title: string,
    firebaseId: string
  ): AppThunk =>
  async (dispatch) => {
    try {
      if (firebaseId) {
        deleteTitleFB(userId, firebaseId);
        dispatch(setFirebaseId(''));
      } else {
        const firebaseId = await addTitleFB(
          userId,
          id,
          mediaType,
          posterPath,
          title
        );
        if (firebaseId) dispatch(setFirebaseId(firebaseId));
      }
    } catch (error) {
      console.error(error);
    }
  };

export default title.reducer;
