import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <div className="mb-6 text-8xl font-black gradient-text">404</div>
      <h1 className="mb-3 text-2xl font-bold">
        Page introuvable
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
        Retournez à l&apos;accueil pour explorer nos solutions de rénovation durable.
      </p>
      <div className="flex gap-4">
        <Link
          href="/fr"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-eco-green to-energy-blue px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Accueil
        </Link>
        <Link
          href="/fr/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Blog 3RI
        </Link>
      </div>
    </div>
  );
}
