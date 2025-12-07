import { IStock } from '@src/models/Stock';
import { IUser } from '@src/models/User';

/**
 * Validation personnalisée: Vérifie que la date d'expiration est dans le futur
 */
export function validateFutureDate(date: Date): boolean {
  return new Date(date) > new Date();
}

/**
 * Validation personnalisée: Vérifie que le mot de passe contient
 * au moins une majuscule, une minuscule et un chiffre
 */
export function validatePasswordStrength(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * Validation personnalisée: Vérifie que l'âge est valide (18-120 ans)
 */
export function validateAdultAge(dateOfBirth: Date): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Ajuster si l'anniversaire n'est pas encore passé cette année
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18 && age <= 120;
}

/**
 * Validation personnalisée: Vérifie que le nom du produit ne contient
 * pas de caractères spéciaux
 *
 * REF: Généré par ChatGPT
 */
export function validateStockName(name: string): boolean {
  const regex = /^[a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ\s-]+$/;
  return regex.test(name);
}

/**
 * Messages d'erreur personnalisés pour les validateurs
 *
 * REF: Généré par ChatGPT
 */
export const CustomValidationMessages = {
  FUTURE_DATE: 'La date d\'expiration doit être dans le futur.',
  PASSWORD_STRENGTH: 'Le mot de passe doit contenir au moins une majuscule, ' + 'une minuscule et un chiffre.',
  ADULT_AGE: 'L\'âge doit être compris entre 18 et 120 ans.',
  INVALID_STOCK_NAME: 'Le nom de l\'action ne peut contenir que des ' + 'lettres, chiffres, espaces et tirets.',
};
