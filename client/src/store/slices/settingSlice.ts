import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';


export interface UserState {
    team: string[];
}

const initialState: UserState = {
    team: [],
};

export const setSaveSettingData = createAction<PrepareAction<UserState[]>>('setting/SaveSeetingData', (data) => {
    console.log(data);

    return {
        payload: data.data,
    };
})

export const userDataTableSlice = createSlice({
    name: 'userDataTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setSaveSettingData, (state, action) => {
            // state.team = action.payload;
        });
    },
});

export default userDataTableSlice.reducer;
