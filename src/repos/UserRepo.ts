import { IUser, Users } from '../models/User';

/**
 * Retourne tous les utilisateurs.
 *
 * @returns IUser
 */
async function getAll(): Promise<IUser[]> {
  const users = await Users.find({});
  return users;
}

/**
 * Retourne un utilisateur par son id.
 *
 * @param id id du user
 * @returns IUser
 */
async function getUserById(id: string): Promise<IUser | null> {
  const user = await Users.findById(id);
  return user;
}

/**
 * Ajoute un utilisateur.
 *
 * @param user
 * @returns Retourne le user créer
 */
async function addUser(user: IUser) {
  const newUser = new Users(user);
  await newUser.save();
  return newUser;
}

/**
 * Met a jour un utilisateur.
 *
 * @param user
 * @returns Retourne le user modifié
 */
async function updateUser(user: IUser): Promise<IUser | null> {
  const userAModifier = await Users.findById({ _id: user._id });
  if (!userAModifier) {
    throw new Error('User non trouvé');
  }
  userAModifier.name = user.name;
  userAModifier.email = user.email;
  userAModifier.password = user.password;
  userAModifier.solde = user.solde;
  userAModifier.isAdmin = user.isAdmin;
  userAModifier.stocks = user.stocks;
  userAModifier.dateOfBirth = user.dateOfBirth;
  userAModifier.createdAt = user.createdAt;

  await userAModifier.save();
  return userAModifier;
}

/**
 * Retourne un utilisateur par son email.
 *
 * @param email
 * @returns IUser | null
 */
async function getByEmail(email: string): Promise<IUser | null> {
  const user = await Users.findOne({ email });
  return user;
}

/**
 * Supprime un utilisateur par son id.
 *
 * @param id
 */
async function deleteUser(id: string): Promise<void> {
  await Users.deleteOne({ _id: id });
}

export default {
  getAll,
  getUserById,
  getByEmail,
  updateUser,
  addUser,
  deleteUser,
} as const;
