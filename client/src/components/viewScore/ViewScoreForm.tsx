import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './NewScoreForm.style';
import { EditScoreTable } from './ScoreTable/EditScoreTable';
import { EventValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import { getAllUsers, saveScore } from '@app/api/score.api';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseCol } from '../common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { RangePicker } from './NewScoreForm.style';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { getAllTeamNames, getTeamUserName, getAllGroupNamesFree } from '@app/api/score.api';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';

export const ViewScore: React.FC = () => {

    const { t } = useTranslation();

    const { user } = useAppSelector((state) => state.user)

    const currentTime: AppDate = Dates.getToday();

    const { teamOptionValue, nameOptionValue } = useAppSelector(({ dropDownValue }) => dropDownValue);

    const [selectedGroupName, setSelectedGroupName] = React.useState('All');
    const [selectedName, setSelectedName] = React.useState('');
    const [selectedTeamName, setSelectedTeamName] = React.useState('');

   
    const teamObject: { value: String }[] = teamOptionValue.map((item) => {
        return { value: item };
    });

    const handleTeamOptionButton = (value: any) => {
        setSelectedTeamName(value)
    }

    const nameObject: { value: string }[] = nameOptionValue.filter((item) => item.teamname === selectedTeamName).map((item) => {
        return { value: item.username };
    });

    if (nameObject?.length > 0) {
        nameObject.unshift({ value: "All" })
    }

    const handleNameOptionButton = (value: any) => {
        setSelectedName(value)
    }
    const [groupOptionValue, setGroupOptionValue] = React.useState<string[]>([])

    React.useEffect(() => {
        getAllGroupNamesFree().then((res) => setGroupOptionValue(res.data))
    }, [])

    const groupObject: { value: string }[] = groupOptionValue.map((item) => {
        return { value: item };
    });

    if (groupObject) {
        groupObject.unshift({ value: "All" })
    }

    const handleGroupOptionButton = (value: any) => {
        setSelectedGroupName(value)
    }
    const dayBefore = currentTime.subtract(1, 'day')

    const [timeRange, setTimeRange] = React.useState<RangeValue<AppDate>>([dayBefore, currentTime]);

    React.useEffect(() => {

        if (timeRange && timeRange[0] && timeRange[1]) {

            setTimeRange(timeRange)
        }

    }, [timeRange])

    return (
        <>
            <S.TablesWrapper>
                <BaseForm>
                    <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                        <S.TeamName>
                            <BaseCol>
                                <BaseButtonsForm.Item name="team">
                                    <BaseSelect placeholder={t('forms.validationFormLabels.team')}
                                        options={teamObject}
                                        onChange={handleTeamOptionButton}>
                                    </BaseSelect>
                                </BaseButtonsForm.Item>
                            </BaseCol>
                        </S.TeamName>

                        <S.TeamName>
                            <BaseCol>
                                <BaseButtonsForm.Item name="user">
                                    <BaseSelect placeholder={t('forms.validationFormLabels.user')}
                                        options={nameObject}
                                        onChange={handleNameOptionButton}>
                                    </BaseSelect>
                                </BaseButtonsForm.Item>
                            </BaseCol>
                        </S.TeamName>

                        <S.TeamName>
                            <BaseCol>
                                <BaseButtonsForm.Item name="group" initialValue={"All"}>
                                    <BaseSelect placeholder={t('forms.validationFormLabels.group')}
                                        options={groupObject}
                                        onChange={handleGroupOptionButton}
                                       >
                                    </BaseSelect>
                                </BaseButtonsForm.Item>
                            </BaseCol>
                        </S.TeamName>

                        <BaseCol>
                            <RangePicker
                                popupClassName="range-picker"
                                value={timeRange}
                                onChange={(dates: RangeValue<AppDate>) => {
                                    setTimeRange(dates);
                                }} />

                        </BaseCol>

                    </BaseRow>
                </BaseForm>
                <S.Card id="score-table" title={t('tables.scores')} padding="1.25rem 1.25rem 0">
                    <EditScoreTable timeRange={timeRange} selectedName={selectedName} selectedTeamName={selectedTeamName} selectedGroupName={selectedGroupName} />
                </S.Card>

            </S.TablesWrapper >
        </>
    );
};
