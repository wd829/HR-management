import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAction, PrepareAction } from '@reduxjs/toolkit';
import {
    doPersonalReport,
    teamReport,
    PersonalDailyReportRequest,
    TeamReportRequest,
    BasicReportTableRow
} from '@app/api/report.api';

export interface PesonalReportState {
    personalReport: BasicReportTableRow[];
}

const initialState: PesonalReportState = {
    personalReport: [],
};

export const setPersonalReportData = createAction<PrepareAction<BasicReportTableRow[]>>('report/getPersonalReportData', (data) => {
    console.log(data);

    return {
        payload: data.data,
    };
})

export const personalReportDataSlice = createSlice({
    name: 'teamReport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setPersonalReportData, (state, action) => {
            state.personalReport = action.payload;
        });
    },
});


export const doReport = createAsyncThunk('report/doReport', async (personalReportPayload: PersonalDailyReportRequest) =>
    doPersonalReport(personalReportPayload),
);

export const doTeamReport = createAsyncThunk('report/doReport', async (teamReportPayload: TeamReportRequest) =>
    teamReport(teamReportPayload),
);

export default personalReportDataSlice.reducer;
