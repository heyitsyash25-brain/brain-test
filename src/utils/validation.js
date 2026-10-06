export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateRequiredFields(fields) {
  return Object.values(fields).every((value) => String(value ?? "").trim().length > 0);
}
