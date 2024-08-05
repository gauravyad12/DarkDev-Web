import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { getList } from '@/api/tmdb';
import { ListTitle, List } from '@/types/tmdb';
import { MOVIES, TV, NETWORKS, COMPANIES } from '@/src/config';

interface ListState {
  [key: string]: {
    page: number;
    titles: ListTitle[];
    totalPages: number;
  };
}

const entries = {
  titles: [],
  page: 1,
  totalPages: 2,
};

const tv = TV.reduce(
  (object, category) => ({
    ...object,
    [`${category}_tv`]: entries,
  }),
  {}
);

const movies = MOVIES.reduce(
  (object, category) => ({
    ...object,
    [`${category}_movie`]: entries,
  }),
  {}
);

const networks = NETWORKS.reduce(
  (object, network) => ({
    ...object,
    [`${network.name}_tv`]: entries,
  }),
  {}
);

const companies = COMPANIES.reduce(
  (object, company) => ({
    ...object,
    [`${company.name}_movie`]: entries,
  }),
  {}
);

const initialState: ListState = {
  ...tv,
  ...movies,
  ...networks,
  ...companies,
};

const list = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setList: (state, action: PayloadAction<List>) => {
      state[action.payload.key] = {
        titles: [
          ...state[action.payload.key].titles,
          ...action.payload.results,
        ],
        page: state[action.payload.key].page,
        totalPages: action.payload.totalPages,
      };
    },
    incrementPage: (state, action: PayloadAction<string>) => {
      state[action.payload] = {
        ...state[action.payload],
        page: state[action.payload].page + 1,
      };
    },
    resetLists: () => initialState,
  },
});

export const { setList, incrementPage, resetLists } = list.actions;

export const fetchList =
  (category: string, mediaType: string, page: number, id?: number): AppThunk =>
  async (dispatch) => {
    try {
      const res = await getList(category, mediaType, page, id);
      dispatch(setList(res));
    } catch (error) {
      console.error(error);
    }
  };

export default list.reducer;
