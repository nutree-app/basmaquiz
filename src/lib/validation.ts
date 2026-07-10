export const REQUIRED_MESSAGE = "هذا الحقل مطلوب";

export function validateName(value: string): string | null {
  if (!value.trim()) return "اكتبي اسمك عشان نكمل";
  if (value.trim().length < 2) return "الاسم قصير جدًا";
  return null;
}

export function validatePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "اكتبي رقم الواتساب";
  if (!/^05\d{8}$/.test(trimmed)) {
    return "رقم الجوال لازم يبدأ بـ 05 ويتكون من 10 أرقام";
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "اكتبي بريدك الإلكتروني";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "الرجاء إدخال بريد إلكتروني صحيح";
  }
  return null;
}

export function validateAge(value: string): string | null {
  if (!value.trim()) return "اكتبي عمرك";
  const age = Number(value);
  if (!Number.isFinite(age) || age < 12 || age > 80) {
    return "الرجاء إدخال عمر صحيح بين 12 و80";
  }
  return null;
}

export function validateWeight(value: string): string | null {
  if (!value.trim()) return "اكتبي وزنك";
  const weight = Number(value);
  if (!Number.isFinite(weight) || weight < 30 || weight > 250) {
    return "الرجاء إدخال وزن صحيح بين 30 و250 كجم";
  }
  return null;
}

export function validateHeight(value: string): string | null {
  if (!value.trim()) return "اكتبي طولك";
  const height = Number(value);
  if (!Number.isFinite(height) || height < 120 || height > 220) {
    return "الرجاء إدخال طول صحيح بين 120 و220 سم";
  }
  return null;
}

export function validateRequiredChoice(value: string): string | null {
  if (!value) return "اختاري إجابة عشان نكمل";
  return null;
}

export function validateInjuryDetails(value: string): string | null {
  if (!value.trim()) return "اكتبي تفاصيل بسيطة عن الحالة الصحية";
  return null;
}
