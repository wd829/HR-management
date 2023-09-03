import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation } from 'react-router-dom';
import { MEDICAL_DASHBOARD_PATH, DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getTeamOptionData, getBillTypeOptionData, getGroupOptionData, getNameOptionData, getUserStatusTypeData } from '@app/store/slices/dropDownValueDataSlice';
import { notificationController } from '@app/controllers/notificationController';

const MainLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();
  const location = useLocation();

  const dispatch = useAppDispatch();

  const toggleSider = () => setSiderCollapsed(!siderCollapsed);

  useEffect(() => {
    setIsTwoColumnsLayout([MEDICAL_DASHBOARD_PATH, DASHBOARD_PATH].includes(location.pathname) && isDesktop);

  }, [location.pathname, isDesktop]);

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

  return (
    <S.LayoutMaster>
      <MainSider isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
      <S.LayoutMain>
        <MainHeader isTwoColumnsLayout={isTwoColumnsLayout}>
          <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} isTwoColumnsLayout={isTwoColumnsLayout} />
        </MainHeader>
        <MainContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
          <div>
            <Outlet />
          </div>
        </MainContent>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainLayout;
