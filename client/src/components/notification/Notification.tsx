import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Notification.style';
import { NotificationTable } from './NotificationTable/EditNotificationTable';
import { InputSearch } from './NotificationSearch.style';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import { getAllTeamNames } from '@app/api/score.api';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseButton } from '../common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { useAppSelector } from '@app/hooks/reduxHooks';
import moment from 'moment';
import { notificationController } from '@app/controllers/notificationController';
import { saveNotification } from '@app/api/user.api';
import { BaseCard } from '../common/BaseCard/BaseCard';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';

const RangePicker = styled(DayjsDatePicker.RangePicker)`
  width: 100%;
  min-width: 250px;
  margin-bottom: 0.875rem;

  & input {
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.semibold};
  }
`;

export const Notification: React.FC = () => {

    const { user } = useAppSelector((state) => state.user)

    const [query, setQuery] = React.useState('');

    const { t } = useTranslation();

    const ref = React.useRef<any>(null);

    const currentTime: AppDate = Dates.getToday();

    const [value, setValue] = React.useState('a');
    const [showRangeRicker, setShowRangePicker] = React.useState(false);
    const [isAlarmModalOpen, setAlarmModalOpen] = React.useState(false);
    const [newAlarmStatus, setNewAlarmStatus] = React.useState(false)
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');

    React.useEffect(() => {
        if (value === 'd') {
            setShowRangePicker(true)
        }
        else {
            setShowRangePicker(false)
        }
    }, [value])

    const startTime = currentTime.set('hour', 8)

    const [timeRange, setTimeRange] = React.useState<RangeValue<AppDate>>([startTime, currentTime]);

    React.useEffect(() => {

        if (timeRange && timeRange[0] && timeRange[1]) {
            setTimeRange(timeRange)
        }

    }, [timeRange])

    const handleAlarmModalCancel = () => {
        setAlarmModalOpen(false)
    }

    const handleAlarmButton = () => {
        setAlarmModalOpen(true);
    }

    const handleInputChange = (event: any) => {
        setTitle(event.target.value)
    }

    const handleContentChange = (event: any) => {
        setContent(event.target.value)
    }

    const handleAlarmModalOk = () => {
        const userName = user?.lastName + ' ' + user?.firstName;

        const currentTime = Date.now()
        const createdAt = moment(new Date(currentTime)).format('YYYY-MM-DD HH:mm:ss');

        if (title && content) {
            saveNotification({ title, content, userName, createdAt }).then(({ data }) => {
                setNewAlarmStatus(true);


                notificationController.success({ message: "Success" })
            }).catch(e => {
                notificationController.error({ message: e.message })
            })
        }
        setAlarmModalOpen(false)
    }

    return (
        <>
            <S.TablesWrapper>

                <S.RadioButton>
                    <BaseRadio.Group onChange={(event) => setValue(event.target.value)} defaultValue="a">
                        <BaseRadio.Button value="a">Today</BaseRadio.Button>
                        <BaseRadio.Button value="b">Yesterday</BaseRadio.Button>
                        <BaseRadio.Button value="c">This week</BaseRadio.Button>
                        <BaseRadio.Button value="d">Custom</BaseRadio.Button>
                    </BaseRadio.Group>

                    {
                        showRangeRicker
                        &&
                        <S.SearchWrapper>
                            <RangePicker
                                popupClassName="range-picker"
                                value={timeRange}
                                onChange={(dates: RangeValue<AppDate>) => {
                                    setTimeRange(dates);
                                }} />
                        </S.SearchWrapper>
                    }

                    <S.HeaderActionWrapper>
                        <InputSearch
                            width="100%"
                            value={query}
                            placeholder={t('header.search')}
                            onChange={(event) => setQuery(event.target.value)}
                            enterButton={null}
                            addonAfter={null}
                            color='red'
                            bordered
                        />
                        <div ref={ref} />
                    </S.HeaderActionWrapper>

                    {(value === 'a' && (user?.role === "Admin")) &&
                        <BaseButton type='ghost' style={{ height: '3rem' }} onClick={handleAlarmButton}>New</BaseButton>}
                </S.RadioButton>

                <S.Card id="reports-table" title={t('common.notification')} padding="1.25rem 1.25rem 0">
                    <NotificationTable timeRange={timeRange} query={query} viewReportItem={value} newAlarmStatus={newAlarmStatus} />
                </S.Card>
            </S.TablesWrapper>

            {isAlarmModalOpen &&
                <BaseModal
                    centered
                    open={isAlarmModalOpen}
                    onOk={handleAlarmModalOk}
                    onCancel={handleAlarmModalCancel}
                    size="large"
                    closable={false}
                >
                    <BaseCard style={{ boxShadow: 'none' }}>
                        <BaseForm title={t('common.notification')} >
                            <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                                <BaseCol span={24}>
                                    <BaseButtonsForm.Item name="title" label={t('common.title')} initialValue={title} >
                                        <BaseInput onChange={handleInputChange} />
                                    </BaseButtonsForm.Item>
                                </BaseCol>

                                <BaseCol span={24}>
                                    <BaseButtonsForm.Item name="content" label={t('common.content')} id={'notificationTextAreaSize'} initialValue={content}>
                                        <BaseInput.TextArea size='large' onChange={handleContentChange} />
                                    </BaseButtonsForm.Item>
                                </BaseCol>
                            </BaseRow>
                        </BaseForm>
                    </BaseCard>
                </BaseModal>
            }
        </>
    );
};
