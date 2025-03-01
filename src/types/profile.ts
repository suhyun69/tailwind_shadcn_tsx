export type ContactInfo = {
  type: string;
  address: string;
  name: string;
}

export type ProfileData = {
  profile_id: string;
  nickname: string;
  sex: string;
  is_instructor: boolean;
  contacts: ContactInfo[];
  bank_info?: {
    bank: string;
    account: string;
    owner: string;
  };
} 