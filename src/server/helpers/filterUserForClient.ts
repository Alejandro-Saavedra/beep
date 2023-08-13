import { type User } from "@clerk/nextjs/dist/types/server";
export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    userName: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
