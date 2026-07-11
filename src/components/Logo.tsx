import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/basmafit-logo.png"
      alt="BasmaFit"
      width={1000}
      height={1000}
      priority
      className="h-auto w-[150px] sm:w-[190px]"
    />
  );
}
