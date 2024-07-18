import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { UserMembership } from "@/api/type";

interface OrganizationState {
  selectedOrganizationId: number | null;
  userMemberships: UserMembership[];
  isOwner: boolean;
}

const initialState: OrganizationState = {
  selectedOrganizationId: null,
  userMemberships: [],
  isOwner: false,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setSelectedOrganization: (state, action: PayloadAction<number>) => {
      state.selectedOrganizationId = action.payload;
    },
    setUserMemberships: (state, action: PayloadAction<UserMembership[]>) => {
      state.userMemberships = action.payload;
    },
    setIsOwner: (state, action: PayloadAction<boolean>) => {
      state.isOwner = action.payload;
    },
    clearOrganizationState: (state) => {
      state.selectedOrganizationId = null;
      state.userMemberships = [];
      state.isOwner = false;
    },
  },
});

export const {
  setSelectedOrganization,
  setUserMemberships,
  setIsOwner,
  clearOrganizationState,
} = organizationSlice.actions;

export default organizationSlice.reducer;

// Sélecteurs
export const selectSelectedOrganizationId = (state: RootState) =>
  state.organization.selectedOrganizationId;
export const selectUserMemberships = (state: RootState) =>
  state.organization.userMemberships;
export const selectIsOrganizationOwner = (state: RootState) =>
  state.organization.isOwner;
