import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 هي الجودة الافتراضية، و90 للقطات جدول التمارين عشان النص العربي يبقى واضح
    qualities: [75, 90],
  },
};

export default nextConfig;
