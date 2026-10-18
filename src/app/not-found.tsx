import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `Page not found — ${site.name}`,
  description: "This page could not be found. Return to Harsh Kumar’s portfolio to explore selected projects and get in touch.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="container not-found-page">
      <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
        harsh5ingh<span>.tech</span>
      </Link>
      <span className="micro-label">404 · Page not found</span>
      <h1>This page took a wrong turn.</h1>
      <p>The address may have changed or the page may no longer exist. My work and contact details are still here.</p>
      <div className="not-found-actions">
        <Link href="/" className="editorial-button">Back to portfolio <ArrowRight size={16} aria-hidden="true" /></Link>
        <Link href="/#contact" className="hero-contact-button">Get in touch</Link>
      </div>
    </main>
  );
}
