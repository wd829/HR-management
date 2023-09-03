import { createGlobalStyle } from 'styled-components';
import { resetCss } from './resetCss';
import { BREAKPOINTS, FONT_SIZE, FONT_WEIGHT, media } from './themes/constants';
import {
  lightThemeVariables,
  darkThemeVariables,
  commonThemeVariables,
  antOverrideCssVariables,
} from './themes/themeVariables';

export default createGlobalStyle`

  ${resetCss}

  [data-theme='light'],
  :root {
    ${lightThemeVariables}
  }

  [data-theme='dark'] {
    ${darkThemeVariables}
  }

  :root {
    ${commonThemeVariables};
    ${antOverrideCssVariables};
  } 

  [data-no-transition] * {
    transition: none !important;
  }
  
.ant-table-thead>tr>th {
    position: relative;
    font-weight: 500;
    text-align: center;
    transition: background .3s ease;
}

.ant-layout-content .ant-row .ant-col #newJobEarnedTableCard .ant-card-body{
  padding: 50px 20px;
}

.ant-layout-content .ant-row .ant-col #newJobEarnedTableCard .ant-card-body .ant-row .ant-table-container .ant-table-content{
  width:770px;
}

.ant-table table {
  width: 100%;
  text-align: center;
  border-collapse: separate;
  border-spacing: 0;
}

  .range-picker {
    & .ant-picker-panels {
      @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px) {
        display: flex;
      flex-direction: column;
      }
    }
  }

  .search-overlay {
    box-shadow: var(--box-shadow);

    @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px)  {
      width: calc(100vw - 16px);
    max-width: 600px;
    }

    @media only screen and ${media.md} {
      width: 323px;
    }
  }

  a {
    color: var(--primary-color);
    &:hover,:active {
      color: var(--ant-primary-color-hover);
    }
  }
  
  .ant-picker-cell {
    color: var(--text-main-color);
  }

  .ant-picker-cell-in-view .ant-picker-calendar-date-value {
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.bold};
  }

  .ant-picker svg {
    color: var(--text-light-color);
  }

  .ant-popover-inner-content {
    padding: 12px 16px;
    color: var(--text-main-color);
    /* height: 8rem; */
    
}

#AlarmModarlOpenDialog .ant-modal-content{
  box-shadow: none;
}

.ant-layout-content{
  margin-top : 2.5rem;
  {
    .ant-row{
      .ant-col{
        width:100%
      }
    }
  }
}

.ant-card-body .ant-form-item-row .ant-form-item-control-input-content #title{
  height:80px;
}

.ant-card-body .ant-form-item-row .ant-form-item-control-input-content #content{
  height:320px;
}

.ant-card-body{
  .ant-row{
    .ant-col{
      .ant-row{
        .ant-col{
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
      }
    }
  }
}

.ant-card .ant-modal-root .ant-modal-centered .ant-modal{
  width:1000px
}

.ant-popover:not(.ant-popover-placement-bottom, .ant-popconfirm){
  width: 40%;
  min-width: 17.5rem;
}

.ant-card-body{
  .ant-picker-range{
    margin-bottom:0
  }
}

.ant-card-body{
    .ant-form-item{
        margin:0
    }
}

.ant-modal-body{
  .ant-spin-container{
    .ant-table-content table{
        max-width:100%
    }
  }
}

.ant-layout-content{
  .ant-col{
    .ant-picker-range{
      width:20%;
    }
  }
}

.ant-popover-placement-topRight .ant-popover-content{
  width: 30%;
  margin-left: auto;
  margin-right: auto;
}

.ant-modal-root .ant-modal-centered .ant-modal {
  width: 300px;
}

#display .ant-row .ant-card .ant-card-body {
  padding: 34px 48px;
}

.ant-col-xs-24{
  .ant-form-item{
    width:100%;
  }
}

.ant-col .dDftIb{
  font-size: 3.125rem;
}

.ant-form-item-control-input{
  width:100%;
}

.ant-pagination-options {
  .ant-select-selector {
    max-height: 2.0625rem;

    .ant-select-selection-item {
      line-height: 2.0625rem;
    }
  }
}
  
  .ant-table tfoot>tr>td, .ant-table tfoot>tr>th, .ant-table-tbody>tr>td, .ant-table-thead>tr>th {
    position: relative;
    padding: 7px;
    overflow-wrap: break-word;
}

  .ant-layout {
   .ant-layout-header {
      height: 3rem;
      padding: 0.5rem 2.25rem;
   }
  }

  // notifications start
  .ant-notification-notice {
    width: 36rem;
    padding: 2rem;
    min-height: 6rem;
    
    .ant-notification-notice-with-icon .ant-notification-notice-message {
      margin-bottom: 0;
      margin-left: 2.8125rem;
    }

    .ant-notification-notice-with-icon .ant-notification-notice-description {
      margin-left: 4.375rem;
      margin-top: 0;
    }

    .ant-notification-notice-icon {
      font-size: 2.8125rem;
      margin-left: 0
    }

    .ant-notification-notice-close {
      top: 1.25rem;
      right: 1.25rem;
    }

    .ant-notification-notice-close-x {
      display: flex;
      font-size: 0.9375rem;
    }

    .notification-without-description {
      .ant-notification-notice-close {
        top: 1.875rem;
      }
      .ant-notification-notice-with-icon .ant-notification-notice-description  {
        margin-top: 0.625rem;
      }
    }
    
    .title {
      font-size: ${FONT_SIZE.xxl};
      height: 3rem;
      margin-left: 1.5rem;
      display: flex;
      align-items: center;
      font-weight: ${FONT_WEIGHT.bold};

      &.title-only {
        color: var(--text-main-color);
        font-size: ${FONT_SIZE.md};
        height: 2rem;
        line-height: 2rem;
        margin-left: 0.75rem;
        font-weight: ${FONT_WEIGHT.semibold};
      }
  }

    .description {
      color: #404040;
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.semibold};
      line-height: 1.375rem;
    }
  
    &.ant-notification-notice-success {
      border: 1px solid var(--success-color);
      background: var(--notification-success-color);
      
      .title {
        color: var(--success-color);
      }
    }
  
    &.ant-notification-notice-info {
      border: 1px solid var(--primary-color);
      background: var(--notification-primary-color);
  
      .title {
        color: var(--primary-color);
      }
    }
  
    &.ant-notification-notice-warning {
      border: 1px solid var(--warning-color);
      background: var(--notification-warning-color);
  
      .title {
        color: var(--warning-color);
      }
    }
  
    &.ant-notification-notice-error {
      border: 1px solid var(--error-color);
      background: var(--notification-error-color);
  
      .title {
        color: var(--error-color);
      }
    }
  
    .success-icon {
      color: var(--success-color);
    }
  
    .info-icon {
      color: var(--primary-color);
    }
  
    .warning-icon {
      color: var(--warning-color);
    }
  
    .error-icon {
      color: var(--error-color);
    }
  }
  
  .ant-menu-inline, .ant-menu-vertical {
    border-right: 0;
  }
  // notifications end
`;
