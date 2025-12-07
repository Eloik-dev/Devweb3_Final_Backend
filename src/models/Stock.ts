import { Schema, model } from "mongoose";
import { validateStockName } from "@src/common/util/validators";
import { CustomValidationMessages } from "@src/common/util/validators";

export interface IStock {
  _id: string;
  stockName: string;
  stockShortName: string;
  quantity: number;
  unitPrice: number;
  isAvailable: boolean;
  tags?: string[];
  buyAt?: Date;
  lastUpdatedAt?: Date;
}

const stockSchema = new Schema({
  stockName: {
    type: String,
    required: [true, "Le nom de l'action est requis."],
    minlength: [1, "Le nom de l'action doit contenir au moins 1 caractère."],
    maxlength: [100, "Le nom de l'action ne peut pas dépasser 100 caractères."],
    validate: {
      validator: validateStockName,
      message: CustomValidationMessages.INVALID_STOCK_NAME,
    },
  },
  stockShortName: {
    type: String,
    required: [true, "Le nom court de l'action est requis."],
    minlength: [1, "Le nom court de l'action doit contenir au moins 1 caractère."],
    maxlength: [5, "Le nom court de l'action ne peut pas dépasser 5 caractères."],
  },
  quantity: {
    type: Number,
    required: [true, "La quantité est requise."],
    min: [0, "La quantité ne peut pas être négative."],
    max: [1000000, "La quantité ne peut pas dépasser 1 000 000."],
  },
  unitPrice: {
    type: Number,
    required: [true, "Le prix unitaire est requis."],
    min: [0, "Le prix unitaire ne peut pas être négatif."],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: (tags: string[]) => tags.every((tag) => tag.length <= 10),
      message: "Chaque tag ne peut pas dépasser 10 caractères.",
    },
  },
  buyAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Stocks = model<IStock>("stocks", stockSchema);
