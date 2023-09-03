import React from 'react';
import {
  HomeOutlined,
  LayoutOutlined,
  UserOutlined,
  DotChartOutlined,
  AreaChartOutlined,
  SettingOutlined,
  GroupOutlined,
  DatabaseOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@app/hooks/reduxHooks';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
  role: string[];
}


export const sidebarNavigation = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    // TODO use path variable
    url: '/',
    icon: <HomeOutlined rev="default value" />,
    role: ['admin', 'general']
  },

  // {
  //   title: 'common.charts',
  //   key: 'charts',
  //   url: '/charts',
  //   icon: <LineChartOutlined />,
  // },
  {
    title: 'common.notification',
    key: 'notification',
    // TODO use path variable
    url: '/notification',
    icon: <NotificationOutlined rev="default value" />,
    role: ['admin', 'general']
  },
  {
    title: 'common.userInfo',
    key: 'userInfo',
    // TODO use path variable
    url: '/users',
    icon: <UserOutlined rev="default value" />,
    role: ['admin', 'general']
  },

  {
    title: 'common.personalReport',
    key: 'personalReport',
    icon: <DatabaseOutlined rev="default value" />,
    children: [
      {
        title: 'common.report',
        key: 'report',
        url: '/personal/report',
        role: ['admin', 'general']
      },
      {
        title: 'common.view',
        key: 'view',
        url: '/personal/view',
        role: ['admin', 'general']
      },
    ],
    role: ['admin', 'general']

  },

  // {
  //   title: 'common.teamReport',
  //   key: 'teamReport',
  //   icon: <AreaChartOutlined />,
  //   children: [
  //     {
  //       title: 'common.new',
  //       key: 'new',
  //       url: '/team/new',
  //     },
  //     {
  //       title: 'common.reports',
  //       key: 'reports',
  //       url: '/team/reports',
  //     },
  //   ],

  {
    title: 'common.score',
    key: 'score',
    icon: <AreaChartOutlined rev="default value" />,
    children: [
      {
        title: 'common.transaction',
        key: 'transaction',
        url: '/score/transaction',
        role: ['admin', 'general']
      },
      {
        title: 'common.total',
        key: 'total',
        url: '/score/total',
        role: ['admin', 'general']
      },
      {
        title: 'common.views',
        key: 'views',
        url: '/score/views',
        role: ['admin']
      },
    ],
    role: ['admin']
  },
  // {
  //   title: 'common.teamReport',
  //   key: 'team',
  //   url: '/team',
  //   icon: <AreaChartOutlined />,
  // },

  // {
  //   title: 'common.profile',
  //   key: 'profile',
  //   icon: <LayoutOutlined />,
  //   url: '/profile',
  // },

  {
    title: 'common.admin',
    key: 'admin',
    icon: <GroupOutlined rev="default value" />,
    children: [
      {
        title: 'common.users',
        key: 'users',
        url: '/admin/users',
        icon: <UserOutlined rev="default value" />,
        role: ['admin']

      },
      {
        title: 'common.settings',
        key: 'settings',
        url: '/admin/setting',
        icon: <SettingOutlined rev="default value" />,
        role: ['admin']
      },
    ],
    role: ['admin']
  },
];


