import { httpApi } from '@app/api/http.api';
import { ReportFormData } from '@app/components/newReport/NewReportForm';
import { TeamReportData } from '@app/components/teamReport/TeamReportForm';
import { Pagination } from './user.api';
import { BasicTableRow } from './user.api';

export interface PersonalDailyReportRequest {
    userId: string;
    values: ReportFormData;
    stringTime: string
}

export interface BasicReportTableRow {
    userName: string;
    _id: string,
    firstName: string,
    lastName: string,
    request: string;
    plan: string;
    achieved: string;
    issue: string;
    userTeam: string;
    performed: string;
    ipMsgId: string;
    other: string;
    key: string,
    createdAt: Date,
    updatedAt: string,
    newJobEarned: string,
    estimated: string,
    date: string,
    skillImprovement: string;
    UserInfo: {
        firstName: string;
        lastName: string
    },
    note: string
}

export interface TeamReportRequest {
    userId: string | undefined;
    values: TeamReportData
}

export interface BasicReportTableData {
    data: BasicReportTableRow[];
    pagination: Pagination;
}

export interface GetPersonalReportDataResponse {
    data: BasicReportTableRow
}

export interface GetTeamLatestReportRequest {
    id: string
}

export interface BasicTeanReportData {
    teams: string
}

export interface BasicPersonalReportData {
    reprts: string
}

export interface GetPersonalReportDataPayload {
    startTime: string,
    endTime: string,
    userId: string
}

export interface GetPersonalReportDataPayloadWithViewItem {
    viewReportItem: string,
    userId: string
}

export interface GetDurationReportDataPayload {
    startTime: string,
    endTime: string
}

export interface GetPersonalReportDataRequest {
    userId: string,
    date: number
}

export interface ReportDetailResponse {
    data: BasicTableRow[]
}

export interface NewJobEarnedResponse {
    data: BasicReportTableRow[]
}

export const doPersonalReport = (dailyReportData: PersonalDailyReportRequest): Promise<GetPersonalReportDataResponse> => {
    return new Promise((res) => {
        httpApi.post<GetPersonalReportDataResponse>('report/personal', { ...dailyReportData }).then(({ data }) => res(data));
    })
}

export const getPersonalReportData = (getPersonalReportPayload: GetPersonalReportDataRequest): Promise<GetPersonalReportDataResponse> => {
    return new Promise((res) => {
        httpApi.post<GetPersonalReportDataResponse>('report/getPersonal', { ...getPersonalReportPayload }).then(({ data }) => res(data));
    })
}

export const teamReport = (teamReportData: TeamReportRequest): Promise<undefined> =>
    httpApi.post<undefined>('report/team', { ...teamReportData }).then(({ data }) => data);

export const getTeamReportData = (getTeamReportDataPayload: GetTeamLatestReportRequest): Promise<BasicTeanReportData> =>
    httpApi.post<BasicTeanReportData>('report/getTeamReport', { _id: getTeamReportDataPayload }).then(({ data }) => data)

export const personalReportData = (getPersonalReportDataPayload: GetPersonalReportDataPayload): Promise<BasicReportTableData> => {
    return new Promise((res) => {
        httpApi.post<BasicReportTableData>('report/getPersonalReport', { ...getPersonalReportDataPayload }).then(({ data }) => res(data))

    })
}

export const getReportData = (getPersonalReportDataPayload: GetPersonalReportDataPayloadWithViewItem): Promise<BasicReportTableData> => {
    return new Promise((res) => {
        httpApi.post<BasicReportTableData>('report/getPersonalReportWithViewItem', { ...getPersonalReportDataPayload }).then(({ data }) => res(data))

    })
}

export const getDurationReportData = (getDurationReportDataPayload: GetDurationReportDataPayload): Promise<BasicReportTableData> => {
    return new Promise((res) => {
        httpApi.post<BasicReportTableData>('report/geDurationReport', { ...getDurationReportDataPayload }).then(({ data }) => res(data))
    })
}

export const getReportDetailsforDispaly = (): Promise<ReportDetailResponse> => {
    return new Promise((res) => {
        httpApi.get<ReportDetailResponse>('/report/getReportMissingUsers', {}).then(({ data }) => res(data))
    })
}

export const getNewJobEarnedData = (): Promise<NewJobEarnedResponse> => {
    return new Promise((res) => {
        httpApi.get<NewJobEarnedResponse>('report/getNewJobEarnedData', {}).then(({ data }) => res(data))
    })
}
