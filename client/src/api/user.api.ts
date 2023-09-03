import { httpApi } from '@app/api/http.api';
import { UserModel } from '@app/domain/UserModel';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PersonalInfoFormValues } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/PersonalInfo';

export interface BasicTableRow {
    firstName: string;
    lastName: string;
    imgUrl: string;
    userName: string;
    sex: 'male' | 'female';
    birthday: string;
    lang: 'en' | 'de';
    role: string,
    stacks: string;
    _id: string,
    key: string,
    ipAddress: string;
    ipMsgId: string;
    netKeyId: string;
    roomNo: string;
    teamNo: string;
    approve: string;
    createdAt: Date;
    group: string;
    updatedAt: string,
    status: string,
    note: string
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
    status: Boolean,
    user: UserModel
}

export interface AllUserNameResponse {
    data: string[]
}

export interface UserStatusTypeResponse {
    data: string[]
}

export interface DeleteUserDataRowRequest {
    rowId: string
}

export interface DeleteNotificationRowRequest {
    rowId: string
}

export interface SaveUserProfileRequest {
    values: PersonalInfoFormValues,
    userId: string | undefined
}

export interface GetUserProfileRequest {
    userId: string | undefined
}

export interface SaveNewTeamNameRequest {
    team: string;
}

export interface SaveNewGroupNameRequest {
    group: string
}

export interface SaveNewBillTypeRequest {
    billType: string
}

export interface SaveUserStatusRequest {
    userStatus: string
}

export interface SaveNewTeamNameResponse {
    data: boolean
}

export interface SaveNewGroupNameResponse {
    data: boolean
}

export interface SaveUserStatusResponse {
    data: boolean
}

export interface BasicTeamSelectData {
    teams: string
}

export interface GetUserProfileResponse {
    data: UserModel;
}

export interface SaveScoreRequest {
    userName: string,
    inCome: string,
    outCome: string,
    date: Date

}

export interface UserDataRowResponse {
    data: BasicTableRow
}

export interface GetScoreRequest {
    data: SaveScoreRequest[]
}

export interface NotificationData {
    title: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    date: string,
    _id: string,
    visitUser: [{
        userId: string,
        indexUser: BasicTableRow,
        visitedTime: string
    }],
    userId: string | undefined,
    userName: string
}

export interface SaveNotificationData {
    title: string,
    content: string,
    createdAt: string,
    userName: string | undefined
}

export interface GetNotificationData {
    createdAt: string;
}

export interface GetNotificationDataPayload {
    startTime: string,
    endTime: string,
    userId: string
}

export interface GetNotificationDataPayloadWithViewItem {
    viewReportItem: string,
    userId: string
}

export interface NotificationDataResponse {
    data: NotificationData[]
}

export interface SaveNotificationResponse {
    data: NotificationData
}

export interface UpdatePayload {
    row: {
        title: string,
        content: string
    };
    key: string
}

export interface ReadNotification {
    alarmId: string,
    userId: string,
    formattedTime: string
}

export interface BirthdayUserResponse {
    data: BasicTableRow[]
}

export const getUserTableData = (): Promise<BasicUserTableData> => {
    return new Promise((res) => {
        httpApi.get<BasicUserTableData>('user/get', {})
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            });
    })
}

export const allow = (allowPayload: AllowRequest): Promise<BasicUserTableData> =>
    httpApi.post<BasicUserTableData>('user/allow', { ...allowPayload }).then(({ data }) => data);

export const saveUserData = (savePayload: SaveUserDataRequest): Promise<UserDataRowResponse> => {
    return new Promise((res) => {
        httpApi.post<UserDataRowResponse>('user/save', { ...savePayload })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            });;
    })
}

export const updateUserStacks = (savePayload: SaveUserDataRequest): Promise<UserDataRowResponse> => {
    return new Promise((res) => {
        httpApi.post<UserDataRowResponse>('user/updateUserStacks', { ...savePayload })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            });;
    })
}

export const deleteUserData = (deletePayload: DeleteUserDataRowRequest): Promise<UserDataRowResponse> => {
    return new Promise((res) => {
        httpApi.post<UserDataRowResponse>('user/delete', { _id: deletePayload })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            });
    })
}

export const saveUserProfile = (savePayload: SaveUserProfileRequest): Promise<GetUserProfileResponse> =>
    httpApi.post<GetUserProfileResponse>('user/saveUserProfile', { ...savePayload }).then(({ data }) => data)

export const getUserProfile = (getUserProfilePayload: GetUserProfileRequest): Promise<GetUserProfileResponse> =>
    httpApi.post<GetUserProfileResponse>('/user/getUserProfile', { _id: getUserProfilePayload }).then(({ data }) => data)

export const saveNewTeamName = (saveNewTeamNamePayload: SaveNewTeamNameRequest): Promise<SaveNewTeamNameResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNewTeamNameResponse>('/setting/saveTeamName', { newTeamName: saveNewTeamNamePayload })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            })
    })
}

export const saveNewGroupName = (saveNewGroupNamePayload: SaveNewGroupNameRequest): Promise<SaveNewGroupNameResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNewGroupNameResponse>('/settingGroup/saveNewGroupName', { newGroupName: saveNewGroupNamePayload })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            })
    })
}

export const saveNewBillType = (saveNewBillTypePayolad: SaveNewBillTypeRequest): Promise<SaveNewGroupNameResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNewGroupNameResponse>('/pay/saveNewBillType', { newBillType: saveNewBillTypePayolad })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            })
    })
}

export const saveUserStatus = (saveUserStausPayload: SaveUserStatusRequest): Promise<SaveUserStatusResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNewGroupNameResponse>('/userStatus/saveUserStatusType', { userStatus: saveUserStausPayload })
            .then(({ data }) => res(data))
    })
}

export const getUserStatusType = (): Promise<UserStatusTypeResponse> => {
    return new Promise((res) => {
        httpApi.get<UserStatusTypeResponse>('/userStatus/getAllUserStatus', {}).then(({ data }) => res(data))
    })
}

export const getTeamSelectData = (): Promise<BasicTeamSelectData> => {
    return new Promise((res) => {
        httpApi.get<BasicTeamSelectData>('setting/get', {})
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            })
    })
}

export const getAllUsers = (): Promise<AllUserNameResponse> => {
    return new Promise((res) => {
        httpApi.get<AllUserNameResponse>('/user/getAllUsers', {})
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            })
    })
}

export const saveScore = (saveScorePayload: SaveScoreRequest): Promise<GetScoreRequest> => {
    return new Promise((res) => {
        httpApi.post<GetScoreRequest>('/score/save', { ...saveScorePayload })
            .then(({ data }) => res(data))
            .catch(e => {
                console.log('An error has occured', e)
            })
    })
}

export const saveNotification = (saveNotificationPayload: SaveNotificationData): Promise<SaveNotificationResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNotificationResponse>('/alarm/save', { ...saveNotificationPayload }).then(({ data }) => res(data))
    })
}

export const getNotification = (): Promise<NotificationDataResponse> => {
    return new Promise((res) => {
        httpApi.get<NotificationDataResponse>('/alarm/get', {}).then(({ data }) => res(data))
    })
}

export const getNotificationData = (getNotificationDataPayload: GetNotificationDataPayload): Promise<NotificationDataResponse> => {
    return new Promise((res) => {
        httpApi.post<NotificationDataResponse>('/alarm/getTimeRangeNotificationData', { ...getNotificationDataPayload }).then(({ data }) => res(data))
    })
}

export const getNotificationDatawithViewItem = (getNotificationDataPayloadWithViewItem: GetNotificationDataPayloadWithViewItem): Promise<NotificationDataResponse> => {
    return new Promise((res) => {
        httpApi.post<NotificationDataResponse>('/alarm/getNotificationDataWithViewItem', { ...getNotificationDataPayloadWithViewItem }).then(({ data }) => res(data))
    })
}


export const deleteAlarm = (deletePayload: DeleteNotificationRowRequest): Promise<SaveNotificationResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNotificationResponse>('/alarm/delete', { id: deletePayload }).then(({ data }) => res(data))
    })
}

export const updateAlarm = (updatePayload: UpdatePayload): Promise<SaveNotificationResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNotificationResponse>('/alarm/update', { ...updatePayload }).then(({ data }) => res(data))
    })
}

export const saveReadNotification = (saveReadNotificationPayload: ReadNotification): Promise<SaveNotificationResponse> => {
    return new Promise((res) => {
        httpApi.post<SaveNotificationResponse>('/alarm/read', { ...saveReadNotificationPayload }).then(({ data }) => res(data))
    })
}

export const getUserBirthday = (): Promise<BirthdayUserResponse> => {
    return new Promise((res) => {
        httpApi.get<BirthdayUserResponse>('/user/getBirthday', {}).then(({ data }) => res(data))
    })
}
