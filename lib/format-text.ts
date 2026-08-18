export function capitalizeFirst(
  value: string | null | undefined
): string {
  if (!value) return "";

  const trimmed = value.trim();

  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function formatPhone(
  phone: string | null | undefined
): string {
  if (!phone) return "";

  const numberWords: Record<string, string> = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const words = phone
    .toLowerCase()
    .trim()
    .split(/\s+/);

  const converted = words
    .map((word) => numberWords[word] ?? word)
    .join("");

  const digits = converted.replace(/\D/g, "");

  // Standard 10-digit US phone number
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(
      3,
      6
    )}-${digits.slice(6)}`;
  }

  // Handle numbers with US country code
  if (digits.length === 11 && digits.startsWith("1")) {
    const number = digits.slice(1);

    return `(${number.slice(0, 3)}) ${number.slice(
      3,
      6
    )}-${number.slice(6)}`;
  }

  // If we don't recognize the number, leave it alone
  return phone;
}