export const ROLE_OWNER = "OWNER";
export const ROLE_MEMBER = "MEMBER";
export const ROLE_ADMIN = "ADMIN";
export type Role = typeof ROLE_MEMBER | typeof ROLE_ADMIN | typeof ROLE_OWNER;

export const ROLES: Role[] = [ROLE_MEMBER, ROLE_ADMIN, ROLE_OWNER];

export const MEMBERS = [
  {
    id: "1",
    createdAt: new Date(),
    email: "you@domain.com",
    name: "You",
    role: ROLES[1],
    teamId: "1",
    userId: "1",
    image: "",
  },
];
