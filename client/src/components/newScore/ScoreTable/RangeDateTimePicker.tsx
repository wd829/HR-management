import React, { ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { BaseHashTag, IHashTag } from '@app/components/common/BaseHashTag/BaseHashTag';
import { useResponsive } from '@app/hooks/useResponsive';
import { newsTags as defaultTags } from '@app/constants/newsTags';
import { AppDate, Dates } from '@app/constants/Dates';
import { Post } from '@app/api/news.api';
import * as S from './RangeDateTimePicker.style';
import { BaseDropdown } from '@app/components/common/BaseDropdown/Dropdown';

interface NewsFilterProps {
    news: Post[];
    newsTags?: IHashTag[];
    children: ({ filteredNews }: { filteredNews: Post[] }) => ReactNode;
}

interface Filter {
    author: string;
    title: string;
    newsTagData: IHashTag[];
    onTagClick: (tag: IHashTag) => void;
    selectedTagsIds: Array<string>;
    selectedTags: IHashTag[];
    dates: [AppDate | null, AppDate | null];
    updateFilteredField: (field: string, value: [AppDate | null, AppDate | null] | string) => void;
    onApply: () => void;
    onReset: () => void;
}

const Filter: React.FC<Filter> = ({
    dates,
    onApply,
    onReset,
    updateFilteredField,
}) => {
    const { t } = useTranslation();

    return (
        <S.FilterWrapper>

            <S.DateLabels>
                <S.DateLabel>{t('newsFeed.from')}</S.DateLabel>
                <S.DateLabel>{t('newsFeed.to')}</S.DateLabel>
            </S.DateLabels>

            <S.RangePicker
                popupClassName="range-picker"
                value={dates}
                onChange={(dates: RangeValue<AppDate>) =>
                    updateFilteredField('dates', [dates?.length ? dates[0] : null, dates?.length ? dates[1] : null])
                }
            />

        </S.FilterWrapper>
    );
};

export const NewsFilter: React.FC<NewsFilterProps> = () => {
    const [filterFields, setFilterFields] = useState<{
        dates: [AppDate | null, AppDate | null];
    }>({
        dates: [null, null],
    });

    const { t } = useTranslation();

    const updateFilteredField = (field: string, value: string | [AppDate | null, AppDate | null]) => {
        setFilterFields({ ...filterFields, [field]: value });
    };

    return (
        <>
            <S.ContentWrapper>
                <S.DateLabels>
                    <S.DateLabel>{t('newsFeed.from')}</S.DateLabel>
                    <S.DateLabel>{t('newsFeed.to')}</S.DateLabel>
                </S.DateLabels>
            </S.ContentWrapper>
        </>
    );
};
