import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Create a new ticket
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

// Fetch user's own tickets
export const fetchMyTickets = createAsyncThunk(
  "ticket/fetchMyTickets",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/tickets/my");
      return res.data.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch all tickets (Admin)
export const fetchTickets = createAsyncThunk(
  "ticket/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/tickets");
      return res.data.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch ticket by ID
export const getTicketById = createAsyncThunk(
  "ticket/getTicketById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/tickets/${id}`);
      return res.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch ticket messages
export const fetchTicketMessages = createAsyncThunk(
  "ticket/fetchMessages",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/tickets/${id}/messages`);
      return res.data.messages;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Send a reply
export const sendReply = createAsyncThunk(
  "ticket/sendReply",
  async ({ id, reply }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/tickets/${id}/reply`, { reply });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Update ticket status
export const updateTicketStatus = createAsyncThunk(
  "ticket/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/tickets/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// Update AI reply (Admin)
export const updateTicketReply = createAsyncThunk(
  "ticket/updateReply",
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
  messages: [],
  loading: false,
  messagesLoading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },
    resetTicket: (state) => {
      state.ticket = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Fetch My Tickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
        state.error = null;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Fetch All Tickets (Admin)
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
      // Get Ticket By ID
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
      // Fetch Messages
      .addCase(fetchTicketMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchTicketMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(fetchTicketMessages.rejected, (state, action) => {
        state.error = action.payload;
        state.messagesLoading = false;
      })
      // Send Reply
      .addCase(sendReply.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendReply.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.messages = [...state.messages, action.payload.data];
        }
        state.error = null;
      })
      .addCase(sendReply.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Update Status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.ticket) {
          state.ticket.status = action.payload.ticket.status;
        }
        state.error = null;
      })
      // Update Reply
      .addCase(updateTicketReply.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload.ticket;
        state.error = null;
      });
  },
});

export const { clearTicketError, resetTicket } = ticketSlice.actions;
export default ticketSlice.reducer;