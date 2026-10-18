import { siteName, siteTagline } from "@/app/site";

export default function KnowledgeLayout({ children }: LayoutProps<"/knowledge">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-24">
      <div className="flex w-full max-w-2xl animate-fade-up flex-col items-center text-center">
        <h1 className="text-6xl font-semibold tracking-tighter text-accent sm:text-8xl">
          {siteName}
        </h1>
        <p className="mt-4 text-xl font-medium tracking-tight text-zinc-500 sm:text-2xl">
          {siteTagline}
        </p>
        <div className="mt-14 w-full">{children}</div>
      </div>
    </main>
  );
}
