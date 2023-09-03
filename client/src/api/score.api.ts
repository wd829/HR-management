import { httpApi } from '@app/api/http.api';
import { UserModel } from '@app/domain/UserModel';
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
    stacks: Array<string>;
    _id: string,
    ipAddress: string;
    ipMsgId: string;
    netKeyId: string;
    roomNo: string;
    teamNo: string;
    approve: string;
    createdAt: Date;
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

export interface UserNameResponse {
    data: { teamname: string, username: string }[]
}

export interface GroupNameResponse {
    data: { group: string, username: string }[]
}

export interface AllNameResponse {
    data: string[]
}

export interface DeleteScoreRowRequest {
    rowId: string | null
}

export interface SaveUserProfileRequest {
    values: PersonalInfoFormValues,
    userId: string | undefined
}

export interface GetUserProfileRequest {
    userId: string | undefined
}

export interface SaveSettingRequest {
    teams: string;
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
    expense: string,
    date: string,
    _id: string | null,
    description: string,
    teamName: string,
    inComePayType: string,
    expensePayType: string,
}

export interface GetScoreResponse {
    userName: string,
    inCome: string,
    expense: string,
    createdAt: Date,
    date: Date,
    _id: string | null,
    description: string,
    teamName: string
}

export interface GetBasicScoreRequest {
    userName: string,
    inCome: string,
    expense: string,
    date: string,
    order: number,
    createdAt: Date,
    key: string | null,
    _id: string,
    profit: string,
    teamName: string,
    description: string,
    group: string,
    inComePayType: string,
    expensePayType: string,
    selectedGroupName: string
}

export interface BasicScoreData {
    selectName: string,
    inCome: string,
    expense: string,
    startTime: Date,
    endTime: Date,
    totalIncome: string,
    totalExpense: string,
    totalRealScore: string,
    selectedTeamName: string
    _id: string
}

export interface GetScoreRequest {
    data: GetBasicScoreRequest;
}

export interface UpDateScoreRequest {
    key: string | null;
    row: SaveScoreRequest;
}

export interface UpDateScoreResponse {
    data: GetBasicScoreRequest
}

export interface GetScoreDataReponse {
    data: GetBasicScoreRequest[],
    pagination: Pagination;
}

export interface GetScoreDataRequest {
    selectedName: string,
    startTime: Date,
    endTime: Date,
    selectedTeamName: string,
    selectedGroupName: string
}

export interface GetAllScoreRequest {
    selectedMonthString: string
}

export interface BasicAllScoreData {
    teamName: string,
    userName: string,
    key: string,
    _id: string,
    1: string,
    2: string,
    3: string,
    4: string,
    5: string,
    6: string,
    7: string,
    8: string,
    9: string,
    10: string,
    11: string,
    12: string,
    13: string,
    14: string,
    15: string,
    16: string,
    17: string,
    18: string,
    19: string,
    20: string,
    21: string,
    22: string,
    23: string,
    24: string,
    25: string,
    26: string,
    27: string,
    28: string,
    29: string,
    30: string,
    31: string,
    '0000': string,
    monthlyProfit: string,
    annual: string,
    rank: string
}

export interface AllScoreData {
    data: BasicAllScoreData[]
}

export interface AllScoreDataDisplay {
    data: {
        formattedResult: BasicAllScoreData[],
        formattedResultMonth: BasicAllScoreData[]
    }
}

// export const getUserTableData = (): Promise<BasicUserTableData> =>
//     httpApi.get<BasicUserTableData>('user/get', {}).then(({ data }) => data)

export const getAllUsers = (): Promise<AllUserNameResponse> => {
    return new Promise((res) => {
        httpApi.get<AllUserNameResponse>('/user/getAllUsers', {}).then(({ data }) => res(data))
    })
}

export const getTeamUserName = (): Promise<UserNameResponse> => {
    return new Promise((res) => {
        httpApi.get<UserNameResponse>('/user/getTeamUserName', {}).then(({ data }) => res(data))
    })
}

export const getAllTeamNames = (): Promise<AllNameResponse> => {
    return new Promise((res) => {
        httpApi.get<AllNameResponse>('/team/getAllTeamNames', {}).then(({ data }) => res(data))
    })
}

export const getAllGroupNames = (): Promise<GroupNameResponse> => {
    return new Promise((res) => {
        httpApi.get<GroupNameResponse>('/user/getAllGroupNames', {}).then(({ data }) => res(data))
    })
}

export const getAllGroupNamesFree = (): Promise<AllNameResponse> => {
    return new Promise((res) => {
        httpApi.get<AllNameResponse>('/settingGroup/getAllGroupNames', {}).then(({ data }) => res(data))
    })
}

export const getAllPayTypeNames = (): Promise<AllNameResponse> => {
    return new Promise((res) => {
        httpApi.get<AllNameResponse>('/pay/getAllPayTypes', {}).then(({ data }) => res(data))
    })
}

export const saveScore = (saveScorePayload: SaveScoreRequest): Promise<Boolean> => {
    return new Promise((res) => {
        httpApi.post<Boolean>('/score/save', { ...saveScorePayload }).then(({ data }) => res(data))
    })
}

export const getScoreResult = (getCurrentTransactionPayload: string): Promise<GetScoreDataReponse> => {
    return new Promise((res) => {
        httpApi.post<GetScoreDataReponse>(`/score/get`, { currentDate: getCurrentTransactionPayload }).then(({ data }) => res(data))
    })
}

export const getScoreData = (getScoreDataPayload: GetScoreDataRequest): Promise<GetScoreDataReponse> => {
    return new Promise((res) => {
        httpApi.post<GetScoreDataReponse>('/score/getScoreData', { ...getScoreDataPayload }).then(({ data }) => res(data))
    })
}

export const updateScore = (updateScorePayload: UpDateScoreRequest): Promise<UpDateScoreResponse> => {
    return new Promise((res) => {
        httpApi.post<UpDateScoreResponse>('/score/update', { ...updateScorePayload }).then(({ data }) => res(data))
    })
}

export const deleteScoreRow = (deleteScoreRowPayload: DeleteScoreRowRequest): Promise<GetScoreRequest> => {
    return new Promise((res) => {
        httpApi.post<GetScoreRequest>('/score/delete', { id: deleteScoreRowPayload }).then(({ data }) => res(data))
    })
}

export const getAllScores = (getAllScorePayload: GetAllScoreRequest): Promise<AllScoreData> => {
    return new Promise((res) => {
        httpApi.post<AllScoreData>('/score/getAllScore', { selectedMonth: getAllScorePayload }).then(({ data }) => res(data))
    })
}

export const getAllScoresforDispaly = (): Promise<AllScoreDataDisplay> => {
    return new Promise((res) => {
        httpApi.get<AllScoreDataDisplay>('/score/getAllScoreforDisplay', {}).then(({ data }) => res(data))
    })
}
