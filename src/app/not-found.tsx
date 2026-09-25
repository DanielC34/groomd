import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="flex-1 flex items-center justify-center py-16 lg:py-24">
        <div className="container max-w-md text-center">
          <span className="block text-6xl md:text-9xl font-display font-extrabold text-[var(--color-surface-muted)]/50 aria-hidden mb-4">
            404
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--color-brand-primary)] mb-4">
            This page took a little off the top.
          </h1>
          <p className="font-body text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="book" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/book">Book an appointment</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}