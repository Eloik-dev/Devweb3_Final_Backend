import { IUserLogin } from "@src/models/User";
import UserService from "@src/services/UserService";
import jwt from "jsonwebtoken";
import ENV from "@src/common/constants/ENV";

export const UTILISATEUR_NOT_FOUND_ERR = "Utilisateur non trouvé";

async function generateToken(utilisateur: IUserLogin): Promise<string> {
  const users = await UserService.getAll();
  const utilisateurBD = users.find((user) => user.email === utilisateur.email);
  if (utilisateurBD && utilisateurBD.password === utilisateur.password) {
    return jwt.sign(utilisateur.email, ENV.Jwtsecret);
  } else {
    return "";
  }
}

export default {
  generateToken,
} as const;
