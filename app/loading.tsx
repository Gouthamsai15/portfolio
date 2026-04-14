import Image from "next/image";
import logoMark from "@/images/logo-mark.png";

export default function Loading() {
  return (
    <div className="app-loading-screen" aria-live="polite" aria-busy="true">
      <div className="app-loading-screen__panel">
        <Image
          src={logoMark}
          alt="GSR logo"
          priority
          className="app-loading-screen__logo"
          sizes="96px"
        />
      </div>
    </div>
  );
}
