import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserModel } from '@app/domain/UserModel';
import * as S from './ProfileInfo.styles';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';

interface ProfileInfoProps {
  profileData: UserModel | null;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData }) => {

  const { t } = useTranslation();

  return profileData ? (
    <S.Wrapper>
      {/* <S.ImgWrapper>
        <BaseAvatar shape="circle" src={profileData?.imgUrl} alt="Profile" />
      </S.ImgWrapper> */}
      <S.Title>{`${profileData?.firstName} ${profileData?.lastName}`}</S.Title>
      <S.Subtitle>{profileData?.userName}</S.Subtitle>
    </S.Wrapper>
  ) : null;
};
