import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarAnimationDelayChart } from '@app/components/charts/BarAnimationDelayChart/BarAnimationDelayChart';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCard } from '../common/BaseCard/BaseCard';
import * as S from './DashboardForm.style'
import { getAllScoresforDispaly } from '@app/api/score.api';
import { BaseButton } from '../common/BaseButton/BaseButton';
import { BasicAllScoreData } from '@app/api/score.api';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { DashboardTable } from './DashboardModal';
import { getReportDetailsforDispaly } from '@app/api/report.api';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getNotification, BasicTableRow, saveReadNotification } from '@app/api/user.api';
import { NotificationDataResponse } from '@app/api/user.api';
import Base from 'antd/lib/typography/Base';
import moment from 'moment';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { EyeOutlined } from '@ant-design/icons';
import { AlarmVisitUserShowModal } from './AlarmVisitUserShowModal';
import { BasicReportTableRow } from '@app/api/report.api';
import { getNewJobEarnedData } from '@app/api/report.api';
import { NewJobEarnedTable } from './NewJobEarnedTable';
import { ReportMissingUserTable } from './ReportMissingUserTable';
import { useNavigate } from 'react-router-dom';
import { getUserBirthday } from '@app/api/user.api';
import { getTeamOptionData, getBillTypeOptionData, getGroupOptionData, getNameOptionData, getUserStatusTypeData } from '@app/store/slices/dropDownValueDataSlice';

export const DashboardForm: React.FC = () => {
    const { t } = useTranslation();

    const { user } = useAppSelector((state) => state.user)
    const [editingKey, setEditingKey] = React.useState('');
    const [scoreData, setScoreData] = React.useState<{ data: BasicAllScoreData[] }>({ data: [] });
    const [annualScoreData, setAnnualScoreData] = React.useState<{ data: BasicAllScoreData[] }>({ data: [] });

    const [reportMissingUser, setReportMissingUsers] = React.useState<{ data: BasicTableRow[] }>({ data: [] })
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [isMouseOver, setIsMouseOver] = React.useState(false);
    const [selectedAlarmId, setSelectedAlarmId] = React.useState('');
    const [openVisitUserMoal, setOpenVisitUserModal] = React.useState(false)
    const [alarmVisitUserData, setAlarmVisitUserData] = React.useState<{ userId: string; indexUser: BasicTableRow; visitedTime: string }[]>([])
    const [alarms, setAlarms] = React.useState<NotificationDataResponse>({ data: [] })
    const [newJobEarnedData, setNewJobEarnedData] = React.useState<{ data: BasicReportTableRow[] }>({ data: [] })

    const { theme } = useAppSelector((state) => state.theme)

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        getUserBirthday().then(res => {
            res.data.map((user) => {
                if (user?.birthday) {
                    notificationController.info({ message: `Today is ${user.lastName + ' ' + user.firstName}'s birthday.` })
                }
            })
        })
            .catch(e => {
                notificationController.error({ message: e })
            })
    }, [])

    React.useEffect(() => {
        getAllScoresforDispaly().then((res) => {

            setScoreData({ data: res.data.formattedResult });
            setAnnualScoreData({ data: res.data.formattedResultMonth });

        })
            .catch(e => {
                notificationController.error({ message: e.message })
            })
    }, [])

    React.useEffect(() => {
        getReportDetailsforDispaly().then((res) => {
            setReportMissingUsers({ data: res.data });
        })
            .catch(e => {
                notificationController.error({ message: e.message })
            })
    }, []);

    React.useEffect(() => {
        getNewJobEarnedData().then((res) => {
            res.data.map((elem) => { return { ...elem, key: elem._id } });
            setNewJobEarnedData({ data: res.data.map((elem) => { return { ...elem, key: elem._id } }) });
        })
            .catch(e => {
                notificationController.error({ message: e.message })
            })
    }, [])

    React.useEffect(() => {
        dispatch(getTeamOptionData())
            .unwrap()
            .then()
            .catch(e => {
                notificationController.error({ message: e })
            })
    }, []);

    React.useEffect(() => {
        dispatch(getNameOptionData())
            .unwrap()
            .then()
            .catch(e => {
                notificationController.error({ message: e })
            })
    }, []);

    React.useEffect(() => {
        dispatch(getGroupOptionData())
            .unwrap()
            .then()
            .catch(e => {
                notificationController.error({ message: e })
            })
    }, []);

    React.useEffect(() => {
        dispatch(getBillTypeOptionData())
            .unwrap()
            .then()
            .catch(e => {
                notificationController.error({ message: e })
            })
    }, []);

    React.useEffect(() => {
        dispatch(getUserStatusTypeData())
            .unwrap()
            .then()
            .catch(e => {
                notificationController.error({ message: e })
            })
    }, []);

    const WinnerComponent = scoreData.data.map((item, index) => {
        if (index >= 8) {
            return
        }

        const style = index < 3 ? { color: 'red', marginRight: '1rem', fontSize: '1rem' } : { marginRight: '1rem', fontSize: '1rem' }

        return <p style={style} key={index}>{item.rank} {item.userName} {item.annual}</p>
    })

    const loserComponent = scoreData.data.map((item, index) => {
        if ((index >= scoreData.data.length - 3) && index < scoreData.data.length) {
            return <p key={index} style={{ marginRight: '1rem', fontSize: '1rem' }}>{item.rank} {item.userName} {item.annual}</p>
        }
    })

    const handleChageButton = () => {
        setIsModalOpen(true)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handleVisitUserShowModalCancel = () => {
        setOpenVisitUserModal(false)
    }

    React.useEffect(() => {

        getNotification().then(res => {
            setAlarms({ data: res.data })
        }).catch(e => {
            notificationController.error({ message: e.message })
        })
    }, [])

    const navigate = useNavigate()

    const handleAlarmButton = () => {
        navigate('/notification', { replace: true });
    }

    const handleClick = (alarmId: string) => {

        const userId = user?._id;

        if (isMouseOver) {

            if (userId && user.role !== 'Admin') {

                const currentTime = Date.now()

                const formattedTime = moment(new Date(currentTime)).format('YYYY-MM-DD HH:mm:ss');

                setSelectedAlarmId(alarmId);

                saveReadNotification({ alarmId, userId, formattedTime }).then(res => {

                    const updatedData = [...alarms.data];

                    const index = updatedData.findIndex(({ _id }) => _id === res.data._id);

                    updatedData[index] = res.data;

                    setAlarms({ ...alarms, data: updatedData });

                    setEditingKey('');

                }).catch(e => {
                    notificationController.error({ message: e.message })
                })
            }
        }
    };

    const colorStyle = {
        color: theme === 'dark' ? 'white' : '#1c68a6'
    };

    const PopOverContent = (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
                user?.role === 'Admin' ?
                    <p style={{ color: '#1c68a6' }}>If you click it, you will see the user names who have visited it!</p>
                    :
                    <p style={colorStyle}>If you read whole content, click it!</p>
            }
        </div>
    );

    const loginUserId = user?._id

    const handleOpenVisitShowModal = (alarmId: string) => {
        setOpenVisitUserModal(true);
        const index = alarms.data.findIndex((alarm) => alarm._id === alarmId);
        setAlarmVisitUserData(alarms.data[index].visitUser)
    }

    const AlarmComponent = alarms.data.map((alarm, index) => {

        const isVisitedAlarm = alarm.visitUser.some((visitedUser) => visitedUser.userId === loginUserId);

        const InsideAlarmComponent =
            <div style={{
                display: 'flex', flexDirection: 'column', borderColor: 'green', border: 'solid 0.1rem',
                margin: '0.1rem', borderRadius: '10px', padding: '1rem', cursor: 'pointer'
            }} key={index}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>

                    <div dangerouslySetInnerHTML={{ __html: alarm.title?.split('\n').join('<br>') }} style={{ color: 'red' }} />

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '32%', marginLeft: 'auto' }}>
                        <S.StyledDiv onClick={() => { return alarm.visitUser.length > 0 && handleOpenVisitShowModal(alarm._id) }}>
                            <p style={{ fontSize: '1rem' }}> <EyeOutlined />
                            </p>
                            <p style={{ marginLeft: '0.2rem', marginRight: '1rem', color: 'grey', fontSize: '1rem' }}>{alarm.visitUser.length}</p>
                        </S.StyledDiv>
                        <p style={{ fontSize: '1rem' }}>
                            {moment(alarm.updatedAt).format('YYYY-MM-DD hh:mm')}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <div dangerouslySetInnerHTML={{ __html: alarm.content?.split('\n').join('<br>') }} style={{ fontSize: '1rem' }} />
                    {(isVisitedAlarm && user?.role !== 'Admin') &&
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"
                            style={{ color: "chartreuse", width: "3rem", height: "3rem" }}
                        >
                            <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                            </path>
                        </svg>
                    }
                </div>
            </div>

        return (isVisitedAlarm || (user?.role === 'Admin') ? (InsideAlarmComponent) : (<BasePopover content={PopOverContent} placement='topRight' key={index}>
            <Base
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                onClick={() => handleClick(alarm._id)}
            >
                {InsideAlarmComponent}
            </Base>
        </BasePopover>)
        )
    })

    return (
        <>
            <BaseRow gutter={{ xs: 10, md: 15, xl: 15 }} style={{ height: '32rem' }}>
                <BaseCol span={12} style={{ paddingBottom: '15px' }}>
                    <BaseCard title={t('common.notifications')} style={{ marginLeft: '1rem' }}>
                        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                            <S.ScoreCard1>
                                <S.AlarmCard style={{ overflowY: 'scroll' }}>
                                    {alarms.data && alarms.data.length > 0 ?
                                        <>{AlarmComponent}</>
                                        : <p style={{ color: 'grey' }}>There are no notifications.</p>
                                    }
                                </S.AlarmCard>
                                <div style={{ marginTop: '2rem' }}>
                                    <BaseButton type='ghost' size='small' onClick={handleAlarmButton}>View All</BaseButton>
                                </div>
                            </S.ScoreCard1>

                        </BaseRow>
                    </BaseCard>
                </BaseCol>
                <BaseCol span={12} style={{ paddingBottom: '15px' }}>
                    <BaseCard title={t('common.reportMissing')} style={{ marginRight: '1rem' }}>
                        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} >
                            <S.ScoreCard1 style={{ overflowY: 'scroll' }}>

                                {reportMissingUser && reportMissingUser.data.length > 0 ?
                                    <>
                                        <ReportMissingUserTable reportMissingUser={reportMissingUser.data} />
                                    </> :
                                    <p style={{ color: 'grey' }}>
                                        Daily Report has to be submitted before 17.00.
                                    </p>}

                            </S.ScoreCard1>
                        </BaseRow>
                    </BaseCard>
                </BaseCol>
                <BaseCol span={12} style={{ paddingBottom: '15px' }}>
                    <BaseCard title={t('common.newJobEarned')} style={{ marginLeft: '1rem' }} id='newJobEarnedTableCard'>
                        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ marginLeft: '0' }} >
                            {newJobEarnedData && newJobEarnedData?.data?.length > 0 ?

                                <NewJobEarnedTable newJobEarnedData={newJobEarnedData?.data} />
                                :
                                <p style={{ color: 'grey' }}>
                                    No new job earned.
                                </p>}

                        </BaseRow>
                    </BaseCard>
                </BaseCol>
                <BaseCol span={12} style={{ paddingBottom: '15px' }}>
                    <BaseCard title={t('common.segment')}>
                        {scoreData.data.length > 0 ?
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <S.ScoreCard>

                                    {WinnerComponent}

                                    <BaseButton type='ghost' size='small' onClick={handleChageButton}>More...</BaseButton>

                                </S.ScoreCard>
                                <S.ScoreCard>

                                    {loserComponent}
                                </S.ScoreCard>
                            </div> :
                            <p style={{ color: 'grey' }}>
                                No Data to display
                            </p>
                        }
                    </BaseCard>
                </BaseCol>
                <BaseCol id="individual-race" span={24}>
                    <BarAnimationDelayChart scoredData={scoreData?.data} annualScoreData={annualScoreData.data} />
                </BaseCol>
            </BaseRow>

            {
                isModalOpen &&
                <div id="DashboardModal">
                    <BaseModal
                        centered
                        open={isModalOpen}
                        onOk={handleModalCancel}
                        onCancel={handleModalCancel}
                        size="medium"
                        closable={false}
                        footer={null}
                    >

                        <DashboardTable scoredData={scoreData.data} />

                    </BaseModal>
                </div>
            }

            {openVisitUserMoal &&
                <BaseModal
                    centered
                    open={openVisitUserMoal}
                    onOk={handleVisitUserShowModalCancel}
                    onCancel={handleVisitUserShowModalCancel}
                    size="medium"
                    closable={false}
                    footer={null}
                >

                    <AlarmVisitUserShowModal alarmVisitUserData={alarmVisitUserData} />

                </BaseModal>}
        </>
    );
};
