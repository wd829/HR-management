import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteUserData, getUserTableData } from '@app/api/user.api';
import { AllowRequest, SaveUserDataRequest, DeleteUserDataRowRequest } from '@app/api/user.api';
import { allow, saveUserData } from '@app/api/user.api';
import { BasicTableRow } from '@app/api/user.api';

export interface UserState {
    user: BasicTableRow[];
}

const initialState: UserState = {
    user: [],
};

export const setUserTableData = createAction<PrepareAction<BasicTableRow[]>>('user/setUserTableData', (data) => {
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
        builder.addCase(setUserTableData, (state, action) => {
            state.user = action.payload;
        });
    },
});

export const getUserData = createAsyncThunk('user/getUserData', async (payload, { dispatch }) => {
    getUserTableData().then(data => {
        dispatch(setUserTableData(data))
    })
});

export const doAllow = createAsyncThunk('user/doAllow', async (allowPayload: AllowRequest, { dispatch }) =>
    allow(allowPayload).then(data =>
        dispatch(setUserTableData(data))
    )
);

export const doSaveUserData = createAsyncThunk('user/doSaveUserData', async (savePayload: SaveUserDataRequest, { dispatch }) =>
    saveUserData(savePayload).then(data => {
        dispatch(setUserTableData(data))
    })
);

export const doDeleteUserRow = createAsyncThunk('user/doDeleteUserRow', async (deletePayload: DeleteUserDataRowRequest, { dispatch }) =>
    deleteUserData(deletePayload).then(data =>
        dispatch(setUserTableData(data))
    )
);

export default userDataTableSlice.reducer;
