import { DEFAULT_CURRENCY_CODE, DEFAULT_LOCALE } from "./localization";

const DECIMAL_MONEY_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;

type MoneyFormatOptions = {
  currencyCode?: string;
  locale?: string;
};

export function parseMoneyToCents(value: string) {
  const normalized = value.trim();

  if (!DECIMAL_MONEY_PATTERN.test(normalized)) {
    throw new Error(
      "El importe debe ser positivo o cero y tener hasta dos decimales.",
    );
  }

  const [whole, fraction = ""] = normalized.replace(",", ".").split(".");
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));

  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError("El importe excede el rango numerico permitido.");
  }

  return Number(cents);
}

export function formatMoney(
  amountInCents: number,
  options: MoneyFormatOptions = {},
) {
  if (!Number.isSafeInteger(amountInCents) || amountInCents < 0) {
    throw new RangeError("El importe debe ser un entero seguro no negativo.");
  }

  return new Intl.NumberFormat(options.locale ?? DEFAULT_LOCALE, {
    style: "currency",
    currency: options.currencyCode ?? DEFAULT_CURRENCY_CODE,
  }).format(amountInCents / 100);
}
