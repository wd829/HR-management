export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  imgUrl: string;
  userName: string;
  sex: 'male' | 'female';
  birthday: string;
  lang: 'en' | 'de';
  role: string,
  stacks: string;
  _id: string,
  ipAddress: string;
  ipMsgId: string;
  netKeyId: string;
  roomNo: string;
  teamNo: string;
  group: string,
  status: string,
  note: string
}
