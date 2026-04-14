import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function PortfolioNotFound() {
  return (
    <div className="not-found-page">
      <p className="not-found-page__eyebrow">Portfolio Not Found</p>
      <h1 className="not-found-page__title">This route is not published yet.</h1>
      <p className="not-found-page__text">
        The portfolio may have been removed or the username may be incorrect. Generate a new one
        from the main dashboard.
      </p>
      <Link href="/" className={buttonStyles({ size: "lg" }) + " not-found-page__action"}>
        Back to Generator
      </Link>
    </div>
  );
}
