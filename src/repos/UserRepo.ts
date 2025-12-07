import { IUser, Users } from "@src/models/User";

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
async function updateUser(user: IUser): Promise<IUser> {
  const userId = user._id || (user as any)._doc?._id;

  const updatedUser = await Users.findByIdAndUpdate(
    userId,
    {
      name: user.name,
      email: user.email,
      solde: user.solde,
      stocks: user.stocks,
      ...(user.password && { password: user.password }),
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User non trouvé");
  }

  return updatedUser;
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
