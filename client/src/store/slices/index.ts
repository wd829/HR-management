import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import userDataTableReducer from '@app/store/slices/userDataTableSlice';
import dropDownValueDataReducer from '@app/store/slices/dropDownValueDataSlice';
import teamMemberReducer from '@app/store/slices/teamMemberSlice'
import teamReportReducer from '@app/store/slices/teamReportSlice'
import personalReportReducer from '@app/store/slices/reportSlice'

export default {
  user: userReducer,
  userDataTable: userDataTableReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  dropDownValue: dropDownValueDataReducer,
  teamMember: teamMemberReducer,
  teamReport: teamReportReducer,
  personalReportReducer: personalReportReducer
};
