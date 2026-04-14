import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-page__eyebrow">404</p>
      <h1 className="not-found-page__title">Page not found</h1>
      <p className="not-found-page__text">
        The page you opened does not exist, or the portfolio route has not been published yet.
      </p>
      <Link href="/" className={buttonStyles({ size: "lg" }) + " not-found-page__action"}>
        Back to Home
      </Link>
    </main>
  );
}
