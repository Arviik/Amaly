import { MembershipType } from "@/api/type";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { membershipTypeApi } from "@/api/services/membershipTypeApi";

interface MembershipTypeState {
  list: MembershipType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MembershipTypeState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchMembershipTypes = createAsyncThunk(
  "membershipTypes/fetchMembershipTypes",
  async (organizationId: number) => {
    return await membershipTypeApi.getMembershipTypesByOrganizationId(
      organizationId
    );
  }
);

const membershipTypeSlice = createSlice({
  name: "membershipTypes",
  initialState,
  reducers: {
    addMembershipType: (state, action) => {
      state.list.push(action.payload);
    },
    updateMembershipType: (state, action) => {
      const index = state.list.findIndex((mt) => mt.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeMembershipType: (state, action) => {
      state.list = state.list.filter((mt) => mt.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembershipTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMembershipTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { addMembershipType, updateMembershipType, removeMembershipType } =
  membershipTypeSlice.actions;

export default membershipTypeSlice.reducer;
