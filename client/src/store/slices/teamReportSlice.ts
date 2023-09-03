import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetTeamMemberDataRequest } from '@app/api/teamMember.api';
import { getTeamReportData } from '@app/api/report.api';

export interface TeamReportState {
    teamReport: string[];
}

const initialState: TeamReportState = {
    teamReport: [],
};

export const setTeamData = createAction<PrepareAction<string[]>>('team/getTeamReport', (data) => {
    console.log(data);

    return {
        payload: data.data,
    };
})

export const teamReportSlice = createSlice({
    name: 'teamReport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setTeamData, (state, action) => {
            state.teamReport = action.payload;
        });
    },
});

export const getLatestReport = createAsyncThunk('team/getTeamReport', async (getTeamReportDataPayload: GetTeamMemberDataRequest, { dispatch }) => {
    getTeamReportData(getTeamReportDataPayload).then(data => {
        dispatch(setTeamData(data))
    })
});

export default teamReportSlice.reducer;
