import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="font-serif text-4xl text-brand">Page not found</h1>
      <p className="text-foreground/60">We couldn&apos;t find what you were looking for.</p>
      <ButtonLink href="/">Go home</ButtonLink>
    </main>
  );
}
