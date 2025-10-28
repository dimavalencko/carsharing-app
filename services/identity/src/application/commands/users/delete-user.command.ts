import { UserRoles } from "@carsharing/common";

export class DeleteUserCommand {
  constructor(
    public readonly userId: string,
    public readonly currentUserRole: UserRoles,
  ) {}
}