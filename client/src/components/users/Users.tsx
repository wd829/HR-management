import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Users.styles';
import { UserTable } from './UsersTable/EditUserTable';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { InputSearch } from './UserSearch.style';

export const Users: React.FC = () => {

    const [query, setQuery] = React.useState('');

    const { t } = useTranslation();

    const ref = React.useRef<any>(null);

    return (
        <>
            <S.TablesWrapper>

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
                </S.SearchWrapper>

                <S.Card id="user-table" title={t('tables.userTable')} padding="1.25rem 1.25rem 0">
                    <UserTable query={query} />
                </S.Card>
            </S.TablesWrapper>
        </>
    );
};
