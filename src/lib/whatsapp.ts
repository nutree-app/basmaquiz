import { WHATSAPP_NUMBER } from "./config";
import { BasmaFitLead } from "./types";

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getQuizCompletionWhatsAppUrl(lead: BasmaFitLead): string {
  const message = `مرحبا، انا جاوبت استمارة بسمة فت وابغى اكمل التسجيل.
الاسم: ${lead.name}
الخطة المناسبة: ${lead.recommendedPlan}
الباقة: ${lead.selectedPackageTitle}
الايميل: ${lead.email}
رقم الجوال: ${lead.phone}`;
  return buildWhatsAppUrl(message);
}

export function getSuccessPageWhatsAppUrl(lead: BasmaFitLead): string {
  const message = `مرحبا، انا اشتركت في برنامج بسمة فت وابغى اكمل التسجيل.

الاسم: ${lead.name}
الخطة المناسبة: ${lead.recommendedPlan}
الباقة: ${lead.selectedPackageTitle}
السعر: ${lead.selectedPackagePrice}
الايميل: ${lead.email}
رقم الجوال: ${lead.phone}

هذه فاتورة الدفع.`;
  return buildWhatsAppUrl(message);
}
