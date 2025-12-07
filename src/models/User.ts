import { Schema, model } from "mongoose";
import { validateAdultAge } from "@src/common/util/validators";
import { CustomValidationMessages } from "@src/common/util/validators";
import { parseObject, TParseOnError } from "jet-validators/utils";
import { isBoolean, isDate, isNumber, isString, isStringArray } from "jet-validators";
import { IStock } from "@src/models/Stock";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  solde: number;
  isAdmin: boolean;
  stocks: IStock[];
  createdAt: Date;
  dateOfBirth?: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis."],
    minlength: [2, "Le nom doit avoir au moins 2 caractères."],
    maxlength: [50, "Le nom ne peut pas dépasser 50 caractères."],
  },
  email: {
    type: String,
    required: [true, "L'email est requis."],
    unique: true,
    match: [/.+@.+\..+/, "Veuillez entrer un email valide."],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis."],
    minlength: [6, "Le mot de passe doit avoir au moins 6 caractères."],
  },
  solde: {
    type: Number,
    default: 0,
    min: [0, "Le solde ne peut pas être négatif."],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  stocks: [
    {
      _id: String,
      stockName: String,
      stockShortName: String,
      quantity: Number,
      unitPrice: Number,
      isAvailable: Boolean,
      tags: [String],
      buyAt: Date,
      lastUpdatedAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "La date de naissance est requise."],
    validate: {
      validator: validateAdultAge,
      message: CustomValidationMessages.ADULT_AGE,
    },
  },
});

export const Users = model<IUser>("User", userSchema);

const DEFAULT_USER_VALS = () => ({
  name: "",
  email: "",
  password: "",
  solde: 0,
  isAdmin: false,
  stocks: [],
  createdAt: new Date(),
  dateOfBirth: new Date(),
});

const parseUser = parseObject<IUser>({
  _id: isString,
  name: isString,
  email: isString,
  password: isString,
  solde: isNumber,
  isAdmin: isBoolean,
  stocks: Array.isArray,
  createdAt: isDate,
  dateOfBirth: isDate,
});

const parseUserLogin = parseObject<IUserLogin>({
  email: isString,
  password: isString,
});

function __new__(user?: Partial<IUser>): IUser {
  const retVal = { ...DEFAULT_USER_VALS(), ...user };
  return parseUser(retVal, (errors) => {
    throw new Error("Setup new user failed " + JSON.stringify(errors, null, 2));
  }) as IUser;
}

/**
 * Check is a user object. For the route validation.
 */
function test(arg: unknown, errCb?: TParseOnError): arg is IUser {
  return !!parseUser(arg, errCb);
}

/**
 * Check is a user login object. For the route validation.
 */
function testlogin(arg: unknown, errCb?: TParseOnError): arg is IUserLogin {
  return !!parseUserLogin(arg, errCb);
}

export default { new: __new__, test, testlogin } as const;
