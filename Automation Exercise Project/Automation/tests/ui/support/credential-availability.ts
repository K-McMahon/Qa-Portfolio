type CredentialEnvironment = Record<string, string | undefined>;

const LOGIN_FIELDS = ['AE_EMAIL', 'AE_PASSWORD', 'AE_USERNAME'] as const;
const PAYMENT_FIELDS = [
  'AE_CARD_NAME',
  'AE_CARD_NUMBER',
  'AE_CARD_CVC',
  'AE_CARD_EXPIRY_MONTH',
  'AE_CARD_EXPIRY_YEAR',
] as const;

function hasRequiredValues(
  environment: CredentialEnvironment,
  fields: readonly string[]
) {
  return fields.every((field) => Boolean(environment[field]?.trim()));
}

export function hasLoginCredentials(
  environment: CredentialEnvironment = process.env
) {
  return hasRequiredValues(environment, LOGIN_FIELDS);
}

export function hasPaymentData(
  environment: CredentialEnvironment = process.env
) {
  return hasRequiredValues(environment, PAYMENT_FIELDS);
}
