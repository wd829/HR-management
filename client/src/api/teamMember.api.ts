import { httpApi } from '@app/api/http.api';
import { UserModel } from '@app/domain/UserModel';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PersonalInfoFormValues } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/PersonalInfo';

export interface BasicTableRow {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    approve: boolean;
    role: string;
    ipAddress: string;
    teamName: string
}

export interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
}

export interface AllowRequest {
    id: string;
    role: string
}

export interface SaveUserDataRequest {
    row: BasicTableRow;
    key: string
}

export interface BasicUserTableData {
    data: BasicTableRow[];
    pagination: Pagination;
}

export interface AllowResponse {
    teamMember: Boolean,
    user: UserModel
}

export interface DeleteUserDataRowRequest {
    rowId: string
}

export interface SaveUserProfileRequest {
    values: PersonalInfoFormValues,
    userId: string | undefined
}

export interface SaveSettingRequest {
    teams: string;
}

export interface BasicTeamSelectData {
    teams: string
}

export interface GetTeamMemberDataRequest {
    id: string
}

// export const getUserTableData = (): Promise<BasicUserTableData> =>
//     httpApi.get<BasicUserTableData>('user/get', {}).then(({ data }) => data)

export const getUserTableData = (): Promise<BasicUserTableData> => {
    return new Promise((res) => {
        httpApi.get<BasicUserTableData>('user/get', {}).then(({ data }) => res(data))
    })
}

export const allow = (allowPayload: AllowRequest): Promise<BasicUserTableData> =>
    httpApi.post<BasicUserTableData>('user/allow', { ...allowPayload }).then(({ data }) => data);

export const save = (savePayload: SaveUserDataRequest): Promise<BasicUserTableData> =>
    httpApi.post<BasicUserTableData>('user/save', { ...savePayload }).then(({ data }) => data);

export const deleteUserData = (deletePayload: DeleteUserDataRowRequest): Promise<BasicUserTableData> =>
    httpApi.post<BasicUserTableData>('user/delete', { _id: deletePayload }).then(({ data }) => data);

export const saveUserProfile = (savePayload: SaveUserProfileRequest): Promise<Boolean> =>
    httpApi.post<Boolean>('user/saveUserProfile', { ...savePayload }).then(({ data }) => data)

export const saveSettingData = (saveSettingPayload: SaveSettingRequest): Promise<undefined> =>
    httpApi.post<undefined>('/setting/saveTeamName', { newTeamName: saveSettingPayload }).then(({ data }) => data)

export const getTeamMemberData = (getTeamMemberDataPayload: GetTeamMemberDataRequest): Promise<BasicTeamSelectData> => {
    return new Promise((res) => {
        httpApi.post<BasicTeamSelectData>('user/getTeamMember', { _id: getTeamMemberDataPayload }).then(({ data }) => res(data))
    })
}



