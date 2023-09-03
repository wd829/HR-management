import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './AllScore.styles';
import { ScoresTable } from './ScoreTable/EditScoreTable';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { InputSearch, Btn } from './ScoreSearch.styles';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { AppDate, Dates } from '@app/constants/Dates';
import { BaseCol } from '../common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import dayjs from 'dayjs';

export const AllScore: React.FC = () => {

    const [query, setQuery] = React.useState('');

    const { t } = useTranslation();

    const ref = React.useRef<any>(null);

    const currentTime: AppDate = Dates.getToday();

    const currentMonth = dayjs(currentTime).month();

    const [selectedMonth, setSelectedMonth] = React.useState<AppDate>((dayjs().month(currentMonth)));

    const handleMonthOptionButton = (value: any) => {
        setSelectedMonth(value)
    }

    return (
        <>
            <S.TablesWrapper>

                <BaseRow>
                    <BaseCol>
                        <DayjsDatePicker picker="month" onSelect={handleMonthOptionButton} defaultValue={selectedMonth} />
                    </BaseCol>
                    <BaseCol>
                        <S.SearchWrapper>
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
                            {/* <HeaderSearch /> */}
                        </S.SearchWrapper>
                    </BaseCol>
                </BaseRow>

                <S.Card id="scoreAll-table" title={t('tables.allScore')} padding="1.25rem 1.25rem 0">
                    <ScoresTable selectedMonth={selectedMonth} query={query} />
                </S.Card>
            </S.TablesWrapper>
        </>
    );
};
