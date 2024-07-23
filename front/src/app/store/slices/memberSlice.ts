import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Member } from "@/api/type";
import * as memberApi from "@/api/services/member";

interface MemberState {
  list: Member[];
  currentMember: Member | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MemberState = {
  list: [],
  currentMember: null,
  status: "idle",
  error: null,
};

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (organizationId: number) => {
    const response = await memberApi.getMembersByOrganizationId(organizationId);
    return response;
  }
);

export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (id: number) => {
    const response = await memberApi.getMemberById(id);
    return response;
  }
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async (member: Member) => {
    const response = await memberApi.createMember(member);
    return response;
  }
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async (member: Member) => {
    const response = await memberApi.updateMember(member.id, member);
    return response;
  }
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id: number) => {
    await memberApi.deleteMember(id);
    return id;
  }
);

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default memberSlice.reducer;
