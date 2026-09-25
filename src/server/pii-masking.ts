export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 1) return "***";
  return `${email[0]}***@${email.slice(at + 1)}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return "***";
  return `***${phone.slice(-2)}`;
}

export function maskValue(value: string): string {
  if (!value) return value;
  return "***";
}

/** Mask a free-form KYC data record for masked-view roles. */
export function maskKycData(
  data: Record<string, unknown>,
  masked: boolean,
): Record<string, unknown> {
  if (!masked) return data;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    const key = k.toLowerCase();
    if (key.includes("email")) out[k] = maskEmail(String(v));
    else if (key.includes("phone")) out[k] = maskPhone(String(v));
    else if (key.includes("dob") || key.includes("birth")) out[k] = maskValue(String(v));
    else out[k] = v;
  }
  return out;
}
