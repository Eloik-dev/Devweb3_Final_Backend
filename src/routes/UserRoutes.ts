import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import UserService from "@src/services/UserService";
import { IUser } from "@src/models/User";

import { IReq, IRes } from "@src/routes/common/types";
import { token } from "morgan";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const user = await UserService.getUserById(id as string);
  if (!user) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
  return res.status(HttpStatusCodes.OK).json({ user });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  const { user } = req.body;
  await UserService.addOne(user as IUser);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = req.body;
  await UserService.updateOne(user as IUser);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = req.params;
  await UserService.delete(id as string);
  return res.status(HttpStatusCodes.OK).end();
}

async function buyStock(req: IReq, res: IRes) {
  const { stockId, quantity } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: "Non authentifié" });
  }

  if (!stockId || typeof stockId !== "string") {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "stockId (string) requis",
    });
  }

  if (typeof quantity !== "number" || quantity < 1) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: "quantity doit être un nombre > 0",
    });
  }

  try {
    const updatedUser = await UserService.buyStock(userId, stockId as string, quantity as number);
    return res.status(HttpStatusCodes.OK).json({ user: updatedUser });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: error instanceof Error ? error.message : "Erreur lors de l'achat",
    });
  }
}

async function login(req: IReq, res: IRes) {
  try {
    const email = req.body.email as string;
    const password = req.body.password as string;

    if (!email || !password) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: "Email et mot de passe requis",
      });
    }

    const result = await UserService.login(email, password);

    // Set httpOnly cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // false en dev
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "none", // 'none' permet cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost", // Partager entre tous les ports localhost
    });

    // Retourner seulement le user (pas le token)
    return res.status(HttpStatusCodes.OK).json({ user: result.user, token: result.token });
  } catch (error) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      error: (error as Error).message,
    });
  }
}

async function register(req: IReq, res: IRes) {
  try {
    const body = req.body as { user: IUser };
    const { user } = body;

    if (!user?.email || !user.password || !user.name) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: "Nom, email et mot de passe requis",
      });
    }

    const newUser = await UserService.register(user);
    return res.status(HttpStatusCodes.CREATED).json({ user: newUser });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: (error as Error).message,
    });
  }
}

async function logout(req: IReq, res: IRes) {
  res.clearCookie("token");
  return res.status(HttpStatusCodes.OK).json({ message: "Déconnexion réussie" });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
  buyStock,
  login,
  register,
  logout,
} as const;
