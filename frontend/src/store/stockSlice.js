import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/stocks');
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const fetchStockDetails = createAsyncThunk('stocks/fetchDetails', async (symbol, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/stocks/${symbol}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const stockSlice = createSlice({
    name: 'stocks',
    initialState: {
        stocks: [],
        selectedStock: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedStock: (state) => {
            state.selectedStock = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStocks.pending, (state) => { state.loading = true; })
            .addCase(fetchStocks.fulfilled, (state, action) => { state.loading = false; state.stocks = action.payload; })
            .addCase(fetchStocks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchStockDetails.pending, (state) => { state.loading = true; })
            .addCase(fetchStockDetails.fulfilled, (state, action) => { state.loading = false; state.selectedStock = action.payload; })
            .addCase(fetchStockDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearSelectedStock } = stockSlice.actions;
export default stockSlice.reducer;
