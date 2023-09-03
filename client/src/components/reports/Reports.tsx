import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Reports.styles';
import { ReportsTable } from './ReportsTable/EditReportTable';
import { InputSearch } from './ReportSearch.styles';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import { getAllTeamNames } from '@app/api/score.api';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { getTeamUserName } from '@app/api/score.api';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { BaseRow } from '../common/BaseRow/BaseRow';
import { useAppSelector } from '@app/hooks/reduxHooks';

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

export const Reports: React.FC = () => {

    const [query, setQuery] = React.useState('');

    const { t } = useTranslation();

    const ref = React.useRef<any>(null);

    const currentTime: AppDate = Dates.getToday();

    const { teamOptionValue, nameOptionValue } = useAppSelector(({ dropDownValue }) => dropDownValue);
    
    const [selectedName, setSelectedName] = React.useState('All');
    const [selectedTeamName, setSelectedTeamName] = React.useState('All');
    const [value, setValue] = React.useState('a');
    const [showRangeRicker, setShowRangePicker] = React.useState(false);

    React.useEffect(() => {
        if (value === 'd') {
            setShowRangePicker(true)
        }
        else {
            setShowRangePicker(false)
        }
    }, [value])

    const handleOptionButton = (value: any) => {
        setSelectedName(value)
    }

    const nameObject: { value: string }[] = nameOptionValue.filter((item) => item.teamname === selectedTeamName).map((item) => {
        return { value: item.username };
    });

    if (nameObject) {
        nameObject.unshift({ value: "All" })
    }

    const teamObject: { value: String }[] = teamOptionValue.map((item) => {
        return { value: item };
    });

    if (teamObject) {
        teamObject.unshift({ value: "All" })
    }

    const handleTeamOptionButton = (value: any) => {
        setSelectedTeamName(value)
    }

    const startTime = currentTime.set('hour', 8)

    const [timeRange, setTimeRange] = React.useState<RangeValue<AppDate>>([startTime, currentTime]);

    React.useEffect(() => {

        if (timeRange && timeRange[0] && timeRange[1]) {
            setTimeRange(timeRange)
        }

    }, [timeRange])

    return (
        <>
            <S.TablesWrapper>

                <S.RadioButton >
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

                    <BaseForm>
                        <BaseRow>
                            <S.TeamName>
                                <BaseButtonsForm.Item name="team" initialValue={'All'}>
                                    <BaseSelect placeholder={t('forms.validationFormLabels.team')}
                                        options={teamObject}
                                        onChange={handleTeamOptionButton}
                                    >
                                    </BaseSelect>
                                </BaseButtonsForm.Item>
                            </S.TeamName>

                            <S.TeamName>
                                <BaseButtonsForm.Item name="name" initialValue={'All'}>
                                    <BaseSelect placeholder={t('forms.validationFormLabels.team')}
                                        options={nameObject}
                                        onChange={handleOptionButton}
                                    >
                                    </BaseSelect>
                                </BaseButtonsForm.Item>
                            </S.TeamName>
                        </BaseRow>
                    </BaseForm>

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
                </S.RadioButton>

                <S.Card id="reports-table" title={t('tables.reports')} padding="1.25rem 1.25rem 0">
                    <ReportsTable timeRange={timeRange} query={query} selectedTeam={selectedTeamName} selectedName={selectedName} viewReportItem={value} />
                </S.Card>
            </S.TablesWrapper>
        </>
    );
};
