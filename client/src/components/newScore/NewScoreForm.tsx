import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './NewScoreForm.style';
import { EditScoreTable } from './ScoreTable/EditScoreTable';
import styled from 'styled-components';
import { EventValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import { BaseDatePicker } from '@app/components/common/pickers/BaseDatePicker';
import { getAllUsers, saveScore } from '@app/api/score.api';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseCol } from '../common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseInput } from '../common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseButton } from '../common/BaseButton/BaseButton';
import { AppstoreAddOutlined, FolderViewOutlined, MoneyCollectOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { SaveScoreRequest } from '@app/api/score.api';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { InputSearch, Btn } from './ScoreSearch.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import { getAllTeamNames, getTeamUserName, getAllGroupNames, getAllPayTypeNames } from '@app/api/score.api';
import moment from 'moment';

const Picker = styled(BaseDatePicker)`
  width: 100%;
`;

export const NewScore: React.FC = () => {

    const { t } = useTranslation();

    const { user } = useAppSelector((state) => state.user)

    const { teamOptionValue, nameOptionValue, billTypeOptionValue } = useAppSelector(({ dropDownValue }) => dropDownValue)

    const currentTime: AppDate = Dates.getToday();

    const [date, setDate] = React.useState<EventValue<AppDate>>(currentTime)

    const teamObject: { value: String }[] = teamOptionValue.map((item) => {
        return { value: item };
    });

    if (teamObject) {
        teamObject.unshift({ value: "All" })
    }

    const [selectedName, setSelectedName] = React.useState('All');
    const [incomeValue, setIncomeValue] = React.useState('0');
    const [expense, setExpense] = React.useState('0');
    const [saveStatus, setSaveStatus] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [description, setDescription] = React.useState('')
    const [selectedTeamName, setSelectedTeamName] = React.useState('All');
    const [inComePayType, setInComePayType] = React.useState('USDT');
    const [expensePayType, setExpensePayType] = React.useState('USDT');
    const [selectedGroupName, setSelectedGroupName] = React.useState('All');

    const _id = user && user._id;

    const ref = React.useRef<any>(null);

    const handleOptionButton = (value: any) => {
        setSelectedName(value)
    }

    const nameObject: { value: string }[] = nameOptionValue.filter((item) => item.teamname === selectedTeamName).map((item) => {
        return { value: item.username };
    });

    if (nameObject) {
        nameObject.unshift({ value: "All" })
    }

    const handleInputInCome = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncomeValue(event.target.value);
    };

    const handleInputOutCome = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpense(event.target.value);
    };

    const handleNote = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleTeamOptionButton = (value: any) => {
        setSelectedTeamName(value)
    }

    const payTypeObject: { value: String }[] = billTypeOptionValue.map((item) => {
        return { value: item };
    });

    const handleInComePayTypeOptionButton = (value: any) => {
        setInComePayType(value)
    }

    const handleExpensePayTypeOptionButton = (value: any) => {
        setExpensePayType(value)
    }

    const handleAddButton = (date: string, inCome: string, expense: string, userName: string, _id: string | null, description: string, teamName: string, inComePayType: string, expensePayType: string) => {
        if (!date) {
            notificationController.warning({ message: "Please select a date" })
            return
        }
        if (!teamName) {
            notificationController.warning({ message: "Please select a team" })
            return
        }
        if (!userName) {
            notificationController.warning({ message: "Please select a user" })
            return
        }
        if (!inCome) {
            notificationController.warning({ message: "Please input an income" })
            return
        }
        if (!expense) {
            notificationController.warning({ message: "Please input a expense" })
            return
        }
        if (!description) {
            notificationController.warning({ message: "Please input a description" })
            return
        }
        if (isNaN(parseFloat(inCome)) || isNaN(parseFloat(expense))) {
            notificationController.warning({ message: "Please enter number" })
            return
        } if (userName === "All" || teamName === 'All') {
            notificationController.warning({ message: "Please select a correct name" })
            return
        }

        console.log('the date we meet', date)

        saveScore({ date, inCome, expense, userName, _id, description, teamName, inComePayType, expensePayType }).then(res => setSaveStatus(true));
    }

    const AdminComponent = user?.role === "Admin" &&
        <BaseForm>
            <BaseRow gutter={[16, 16]}>
                <BaseCol span={8} className="gutter-row">
                    <Picker format="YYYY-MM-DD" onSelect={(dates: EventValue<AppDate>) => {
                        setDate(dates);
                    }} value={date} />
                </BaseCol>
                <BaseCol span={8} className="gutter-row">
                    <BaseButtonsForm.Item name="team" initialValue={'All'}>
                        <BaseSelect placeholder={t('forms.validationFormLabels.team')}
                            options={teamObject}
                            onChange={handleTeamOptionButton}
                        >
                        </BaseSelect>
                    </BaseButtonsForm.Item>
                </BaseCol>
                <BaseCol span={8} className="gutter-row" >
                    <BaseButtonsForm.Item name="teamNo" initialValue={'All'}>
                        <BaseSelect placeholder={t('forms.validationFormLabels.user')}
                            options={nameObject}
                            onChange={handleOptionButton}
                        >
                        </BaseSelect>
                    </BaseButtonsForm.Item>
                </BaseCol>
            </BaseRow>
            <BaseRow gutter={[16, 16]}>
                <BaseCol span={8}>
                    <BaseInput placeholder='Please input an income' onChange={handleInputInCome} value={incomeValue} />
                </BaseCol>
                <BaseCol span={8}>
                    <BaseButtonsForm.Item name="group" initialValue={'USDT'}>
                        <BaseSelect placeholder={t('forms.validationFormLabels.user')}
                            options={payTypeObject}
                            onChange={handleInComePayTypeOptionButton}
                        >
                        </BaseSelect>
                    </BaseButtonsForm.Item>
                </BaseCol>
                <BaseCol span={8}>
                    <BaseInput placeholder='Please input a note' onChange={handleNote} value={description} />
                </BaseCol>
            </BaseRow>
            <BaseRow gutter={[16, 16]}>
                <BaseCol span={8}>
                    <BaseInput placeholder='Please input an expense' onChange={handleInputOutCome} value={expense} />
                </BaseCol>
                <BaseCol span={8}>
                    <BaseButtonsForm.Item name="payType" initialValue={'USDT'}>
                        <BaseSelect placeholder={t('forms.validationFormLabels.user')}
                            options={payTypeObject}
                            onChange={handleExpensePayTypeOptionButton}
                        >
                        </BaseSelect>
                    </BaseButtonsForm.Item>
                </BaseCol>
                <BaseCol span={8}>
                    <BaseButton block type="primary" icon={<AppstoreAddOutlined title='ADD' />} size="middle"
                        onClick={() => handleAddButton(date ? moment(date.toDate()).format('YYYY-MM-DD HH:mm:ss') : (new Date().toLocaleString()), incomeValue, expense, selectedName, _id, description, selectedTeamName, inComePayType, expensePayType)} >
                        ADD
                    </BaseButton>
                </BaseCol>
            </BaseRow>
        </BaseForm>

    return (
        <>
            <S.TablesWrapper>

                {/* <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}> */}
                <BaseRow gutter={[8, 16]} align='bottom' justify='space-between'>
                    <BaseCol span={18}>

                        {AdminComponent}
                    </BaseCol>

                    <BaseCol span={6} style={{ textAlign: 'right', marginBottom: '0' }}>
                        <HeaderActionWrapper>
                            <InputSearch
                                width="100%"
                                value={query}
                                placeholder={t('header.search')}
                                onChange={(event) => setQuery(event.target.value)}
                                enterButton={null}
                                addonAfter={null}
                            />
                            <div ref={ref} />
                        </HeaderActionWrapper>
                    </BaseCol>

                </BaseRow>


                <S.Card id="transaction-table" title={t('tables.transactions')} padding="1.25rem 1.25rem 0">
                    <EditScoreTable saveStatus={saveStatus} query={query} date={date} setSaveStatus={setSaveStatus}
                        selectedTeamName={selectedTeamName} selectedName={selectedName} />
                </S.Card>

            </S.TablesWrapper >
        </>
    );
};
