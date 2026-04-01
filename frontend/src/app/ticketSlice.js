import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export const createTicket = createAsyncThunk(
  "ticket/createTicket",
  async (ticketData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/tickets", ticketData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchTickets = createAsyncThunk(
  "ticket/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/tickets");
      return res.data.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getTicketById = createAsyncThunk(
  "ticket/ticketById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/tickets/${id}`);
      return res.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "ticket/ticketStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/tickets/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const updateTicketReply = createAsyncThunk(
  "ticket/ticketsreply",
  async ({ id, reply }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/tickets/${id}/reply`, { reply });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  tickets: [],
  ticket: null,
  loading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload.ticket;
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
        state.error = null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getTicketById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload;
        state.error = null;
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload.ticket;
        state.error = null;
      })
      .addCase(updateTicketReply.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload.ticket;
        state.error = null;
      });
  },
});

export default ticketSlice.reducer;
