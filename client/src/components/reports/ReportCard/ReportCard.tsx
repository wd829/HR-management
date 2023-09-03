import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ReportCard.style';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

interface ReportCardProps {
    userName: string;
    performed: string;
    achieved: string;
    request: string;
    issue: string;
    plan: string;
    realName: string;
    userTeam: string;
    ipMsgId: string;
    other: string;
    skillImprovement: string
};

export const ReportCard: React.FC<ReportCardProps> = ({ other, ipMsgId, userTeam, realName, userName,
    performed, achieved, request, issue, plan, skillImprovement }) => {

    const { t } = useTranslation();

    return (
        <S.DoctorCard>

            <BaseRow>

                <BaseCol span={24}>
                    <BaseRow align={'middle'} justify={'center'} gutter={[10, 10]}>
                        <BaseCol>
                            <S.Header><h1>{userTeam} / {realName}</h1></S.Header>
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow align={'middle'} justify={'center'} gutter={[10, 10]}>
                        <BaseCol>
                            <S.Header><h1>UserName: {userName}, IPMsgId: {ipMsgId}</h1></S.Header>
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>
                                {t('common.done')}
                            </S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            {/* <S.Text> */}
                            <div dangerouslySetInnerHTML={{__html: performed?.split('\n').join('<br>')}} />
                            {/* </S.Text> */}
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>{t('common.achieved')}</S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            {/* <S.Text>{achieved}</S.Text> */}
                            <div dangerouslySetInnerHTML={{__html: achieved?.split('\n').join('<br>')}} />
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>{t('common.issue')}</S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            <div dangerouslySetInnerHTML={{__html: issue?.split('\n').join('<br>')}} />
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>{t('common.skillImprove')}</S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            <div dangerouslySetInnerHTML={{__html: skillImprovement?.split('\n').join('<br>')}} />
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>{t('common.plan')}</S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            {/* <S.Text>{plan}</S.Text> */}
                            <div dangerouslySetInnerHTML={{__html: plan?.split('\n').join('<br>')}} />
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>{t('common.request')}</S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            {/* <S.Text>{request}</S.Text> */}
                            <div dangerouslySetInnerHTML={{__html: request?.split('\n').join('<br>')}} />
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

                <BaseCol span={24}>
                    <BaseRow>
                        <BaseCol span={24}>
                            <S.Title>{t('common.other')}</S.Title>
                        </BaseCol>

                        <BaseCol span={24}>
                            {/* <S.Text>{other}</S.Text> */}
                            <div dangerouslySetInnerHTML={{__html: other?.split('\n').join('<br>')}} />
                        </BaseCol>
                    </BaseRow>
                </BaseCol>

            </BaseRow>
        </S.DoctorCard>
    );
};
