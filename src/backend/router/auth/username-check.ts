import { Connection } from "typeorm";
import { User } from "../../entity/user";

export async function usernameCheck(username: string, connection: Connection): Promise<boolean> {
  const users = connection.getRepository(User);
  const result = await users.findOne({
    where: {
      username
    }
  });
  return Boolean(result);
}