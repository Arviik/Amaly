import { membershipTypeApi } from "@/api/services/membershipTypeApi";
import { MembershipType } from "@/api/type";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
    const response = await membershipTypeApi.getMembershipTypesByOrganizationId(
      organizationId
    );
    return response;
  }
);

export const createMembershipType = createAsyncThunk(
  "membershipTypes/createMembershipType",
  async (membershipType: MembershipType) => {
    const response = await membershipTypeApi.createMembershipType(
      membershipType
    );
    return response;
  }
);

export const updateMembershipType = createAsyncThunk(
  "membershipTypes/updateMembershipType",
  async (membershipType: MembershipType) => {
    const response = await membershipTypeApi.updateMembershipType(
      membershipType.id,
      membershipType
    );
    return response;
  }
);

export const deleteMembershipType = createAsyncThunk(
  "membershipTypes/deleteMembershipType",
  async (id: number) => {
    await membershipTypeApi.deleteMembershipType(id);
    return id;
  }
);

const membershipTypeSlice = createSlice({
  name: "membershipTypes",
  initialState,
  reducers: {},
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
      })
      .addCase(createMembershipType.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateMembershipType.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (mt: MembershipType) => mt.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteMembershipType.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (mt: MembershipType) => mt.id !== action.payload
        );
      });
  },
});

export default membershipTypeSlice.reducer;
