import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import { brotliCompress } from 'zlib';
import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';
import bcrypt from 'bcrypt';

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = 'User not found';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Retourne tous les utilisateurs.
 *
 * @returns IUser
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Retourne un utilisateur par son id.
 *
 * @param id
 * @returns IUser | null
 */
function getUserById(id: string): Promise<IUser | null> {
  return UserRepo.getUserById(id);
}

/**
 * Ajoute un utilisateur.
 *
 * @param user
 * @returns Retourne le user créé
 */
function addOne(user: IUser): Promise<IUser | null> {
  return UserRepo.addUser(user);
}

/**
 * Met a jour un utilisateur.
 *
 * @param user
 * @returns Retourne le user modifié
 */
function updateOne(user: IUser): Promise<IUser | null> {
  return UserRepo.updateUser(user);
}

/**
 * Efface un utilisateur par son id.
 *
 * @param id
 */
function _delete(id: string): Promise<void> {
  return UserRepo.deleteUser(id);
}

// SourceChatGPT : Promise<Omit<IUser, "password">>
async function login(email: string, password: string): Promise<{ user: Omit<IUser, 'password'>, token: string }> {
  const user = await UserRepo.getByEmail(email);

  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  let isValidPassword = false;

  // Vérifier si le mot de passe est hashé (nouveau utilisateur)
  if (user.password.startsWith('$2b$')) {
    isValidPassword = await bcrypt.compare(password, user.password);
  } else {
    // Mot de passe en clair (création bd ancienne)
    isValidPassword = password === user.password;
  }

  if (!isValidPassword) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = jwt.sign({ id: user._id, email: user.email }, ENV.Jwtsecret, { expiresIn: '24h' });

  const userObject = (user as any).toObject ? (user as any).toObject() : { ...user };
  const { password: _, ...userWithoutPassword } = userObject;

  return { user: userWithoutPassword, token };
}

// SourceChatGPT : Promise<Omit<IUser, "password">>
async function register(userData: IUser): Promise<Omit<IUser, 'password'>> {
  const existingUser = await UserRepo.getByEmail(userData.email);

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  //HASH MOT DE PASSE
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  //Ajouter le mot de passe hashé à l'utilisateur
  const newUser: IUser = {
    ...userData,
    password: hashedPassword,
  };

  await UserRepo.addUser(newUser);

  // Retourner sans le mot de passe (IMPORTANT)
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getUserById,
  addOne,
  updateOne,
  delete: _delete,
  login,
  register,
} as const;
