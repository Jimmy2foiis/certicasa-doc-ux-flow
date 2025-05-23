
/**
 * Formate un nombre en devise (€)
 * @param value Valeur à formater
 * @param options Options de formatage
 * @returns Chaîne formatée
 */
export const formatCurrency = (
  value: number,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  } = {}
): string => {
  const {
    currency = "EUR",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    locale = "fr-FR"
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
};

/**
 * Formate une date en chaîne localisée
 * @param date Date à formater
 * @param locale Locale à utiliser
 * @returns Chaîne formatée
 */
export const formatDate = (
  date: Date | string,
  locale: string = "fr-FR"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

/**
 * Formate un nombre avec séparateur de milliers
 * @param value Nombre à formater
 * @param locale Locale à utiliser
 * @returns Chaîne formatée
 */
export const formatNumber = (
  value: number,
  locale: string = "fr-FR"
): string => {
  return new Intl.NumberFormat(locale).format(value);
};
