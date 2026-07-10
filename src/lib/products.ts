import { PRODUCT_LINKS } from "./config";
import { ProductKey } from "./types";

export interface Product {
  key: ProductKey;
  title: string;
  price: string;
  link: string;
  description: string;
  buttonLabel: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  GYM: {
    key: "GYM",
    title: "جدول النادي",
    price: "39 ريال",
    link: PRODUCT_LINKS.GYM,
    description:
      "برنامج تمارين مخصص للنادي يساعدك على الوصول لهدفك بخطة مرتبة تشمل تمارين مقاومة وأجهزة، مع توزيع واضح للأيام والعضلات ومستويات مناسبة للتدرج.",
    buttonLabel: "عرض البرنامج",
  },
  HOME: {
    key: "HOME",
    title: "جدول المنزل",
    price: "39 ريال",
    link: PRODUCT_LINKS.HOME,
    description:
      "برنامج تمارين منزلي سهل ومرن يساعدك على الالتزام من البيت باستخدام تمارين عملية ومناسبة للمساحة المنزلية، مع خطة واضحة تناسب المبتدئات ومستويات مختلفة.",
    buttonLabel: "عرض البرنامج",
  },
};
