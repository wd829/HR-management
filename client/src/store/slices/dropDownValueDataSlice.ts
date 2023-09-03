import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllTeamNames, getTeamUserName } from '@app/api/score.api';
import { getAllGroupNamesFree, getAllPayTypeNames } from '@app/api/score.api';
import { getUserStatusType } from '@app/api/user.api';

export interface TeamAndGroupData {
    teamOptionValue: String[],
    nameOptionValue: { teamname: string, username: string }[],
    groupOptionValue: String[],
    billTypeOptionValue: String[],
    userStatusType: String[]
}

const initialState: TeamAndGroupData = {
    teamOptionValue: [],
    nameOptionValue: [],
    groupOptionValue: [],
    billTypeOptionValue: [],
    userStatusType: []
};

export const setTeamOptionData = createAction<PrepareAction<string[]>>('team/setTeamOptionData', (data) => {
    return {
        payload: data.data,
    };
})

export const setGroupOptionData = createAction<PrepareAction<string[]>>('group/setGroupOptionData', (data) => {
    return {
        payload: data.data,
    };
})

export const setNameOptionData = createAction<PrepareAction<{ teamname: string, username: string }[]>>('name/setNameOptionData', ({ data }) => {
    return {
        payload: data,
    };
})

export const setBillTypeOptionData = createAction<PrepareAction<string[]>>('bill/setBillTypeOptionData', (data) => {
    return {
        payload: data.data,
    };
})

export const setUserStatusTypeData = createAction<PrepareAction<string[]>>('user/setUserStatusTypeData', (data) => {
    return {
        payload: data.data,
    };
})

export const dropDownValueDataSlice = createSlice({
    name: 'dropDownValue',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(setTeamOptionData, (state, action) => {
            state.teamOptionValue = action.payload;
        });
        
        builder.addCase(setNameOptionData, (state, action) => {
            state.nameOptionValue = action.payload;
        });

        builder.addCase(setGroupOptionData, (state, action) => {
            state.groupOptionValue = action.payload;
        });
        
        builder.addCase(setBillTypeOptionData, (state, action) => {
            state.billTypeOptionValue = action.payload
        });
        
        builder.addCase(setUserStatusTypeData, (state, action) => {
            state.userStatusType = action.payload
        })

    },
});

export const getTeamOptionData = createAsyncThunk('team/setTeamOptionData', async (payload, { dispatch }) => {
    getAllTeamNames().then(data => {
        dispatch(setTeamOptionData(data))
    })
});

export const getNameOptionData = createAsyncThunk('name/setNameOptionData', async (payload, { dispatch }) => {
    getTeamUserName().then(data => {
        dispatch(setNameOptionData(data))
    })
});

export const getGroupOptionData = createAsyncThunk('group/setGroupOptionData', async (payload, { dispatch }) => {
    getAllGroupNamesFree().then(data => {
        dispatch(setGroupOptionData(data))
    })
});

export const getBillTypeOptionData = createAsyncThunk('bill/setBillTypeOptionData', async (payload, { dispatch }) => {
    getAllPayTypeNames().then(data => {
        dispatch(setBillTypeOptionData(data))
    })
});

export const getUserStatusTypeData = createAsyncThunk('user/setUserStatusTypeData', async (payload, { dispatch }) => {
    getUserStatusType().then(data => {
        dispatch(setUserStatusTypeData(data))
    })
});

export default dropDownValueDataSlice.reducer;
