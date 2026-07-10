import { WHATSAPP_NUMBER } from "./config";
import { BasmaFitLead } from "./types";

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getSupportWhatsAppUrl(lead: BasmaFitLead | null): string {
  if (!lead || !lead.selectedProductTitle) {
    return buildWhatsAppUrl("مرحبًا، أحتاج مساعدة في إكمال الاشتراك في BasmaFit.");
  }

  const message = `مرحبًا، أكملت اختبار BasmaFit واخترت ${lead.selectedProductTitle}.

هدفي: ${lead.goal}
مكان التمرين: ${lead.trainingLocation}
المستوى: ${lead.level}
عدد أيام التمرين: ${lead.trainingDays}

أحتاج مساعدة في إكمال الاشتراك والدفع.`;
  return buildWhatsAppUrl(message);
}

export function getInvoiceWhatsAppUrl(lead: BasmaFitLead): string {
  const message = `مرحبًا، أكملت الدفع لـ ${lead.selectedProductTitle} في BasmaFit.

هدفي: ${lead.goal}
مكان التمرين: ${lead.trainingLocation}
المستوى: ${lead.level}
عدد أيام التمرين: ${lead.trainingDays}

هذه فاتورة الدفع، بانتظار تفعيل اشتراكي.`;
  return buildWhatsAppUrl(message);
}
