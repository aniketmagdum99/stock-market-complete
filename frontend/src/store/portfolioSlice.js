import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

export const fetchPortfolio = createAsyncThunk('portfolio/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/trades/portfolio');
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const buyStock = createAsyncThunk('portfolio/buy', async (tradeData, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.post('/trades/buy', tradeData);
        dispatch(fetchPortfolio());
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const sellStock = createAsyncThunk('portfolio/sell', async (tradeData, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.post('/trades/sell', tradeData);
        dispatch(fetchPortfolio());
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: {
        holdings: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        resetStatus: (state) => {
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortfolio.pending, (state) => { state.loading = true; })
            .addCase(fetchPortfolio.fulfilled, (state, action) => { state.loading = false; state.holdings = action.payload; })
            .addCase(fetchPortfolio.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(buyStock.fulfilled, (state, action) => { state.message = action.payload.message; })
            .addCase(buyStock.rejected, (state, action) => { state.error = action.payload; })
            .addCase(sellStock.fulfilled, (state, action) => { state.message = action.payload.message; })
            .addCase(sellStock.rejected, (state, action) => { state.error = action.payload; });
    },
});

export const { resetStatus } = portfolioSlice.actions;
export default portfolioSlice.reducer;
