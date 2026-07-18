/**
 * Email Translation Utilities
 * Gets translations from the i18n system for email templates
 * Instead of hardcoding translations, emails fetch them from messages/*.json
 */

import en from "@/messages/en.json";
import et from "@/messages/et.json";
import ru from "@/messages/ru.json";

type LanguageCode = "en" | "et" | "ru";

const translations = {
  en,
  et,
  ru,
};

/**
 * Get email translations for a specific template and language
 * @param templateName - The email template name (e.g., 'emailVerify', 'welcome')
 * @param language - The language code (en, et, ru)
 * @returns Translation object for the template
 */
export function getEmailTranslations(
  templateName: string,
  language: LanguageCode = "en"
) {
  const langTranslations = translations[language] || translations.en;
  return (langTranslations as any).emails?.[templateName] || {};
}

/**
 * Helper to get all available translations for an email template
 * @param templateName - The email template name
 * @returns Object with translations for all languages
 */
export function getAllEmailTranslations(templateName: string) {
  return {
    en: getEmailTranslations(templateName, "en"),
    et: getEmailTranslations(templateName, "et"),
    ru: getEmailTranslations(templateName, "ru"),
  };
}
