export type ContactGroup = {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ContactGroupMember = {
  id: string;
  groupId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactGroupDetail = ContactGroup & {
  members: ContactGroupMember[];
};
