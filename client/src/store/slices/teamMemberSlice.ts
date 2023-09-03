import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTeamMemberData, GetTeamMemberDataRequest } from '@app/api/teamMember.api';

export interface TeamState {
    team: string[];
}

const initialState: TeamState = {
    team: [],
};

export const setTeamData = createAction<PrepareAction<string[]>>('team/getTeamMember', (data) => {
    console.log(data);

    return {
        payload: data.data,
    };
})

export const teamMemberSlice = createSlice({
    name: 'teamMember',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setTeamData, (state, action) => {
            state.team = action.payload;
        });
    },
});

export const getTeamMember = createAsyncThunk('team/getTeamMember', async (getTeamMemberDataPayload: GetTeamMemberDataRequest, { dispatch }) => {
    getTeamMemberData(getTeamMemberDataPayload).then(data => {
        dispatch(setTeamData(data))
    })
});

export default teamMemberSlice.reducer;
