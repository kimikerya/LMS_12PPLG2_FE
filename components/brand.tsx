import { Icon } from "./icon";
import Image from "next/image";
export function Brand({ schoolLogo = false, subtitle = "Education Management System" }: { schoolLogo?: boolean; subtitle?: string }) {
  return <div className="brand">{schoolLogo ? <Image className="school-logo" src="/figma/landing/imgLogoCn1.png" alt="" width={56} height={48} /> : <span className="brand-mark"><Icon name="school" width={25} height={25} /></span>}<span><strong>SMK Citra Negara</strong><small>{subtitle}</small></span></div>;
}
