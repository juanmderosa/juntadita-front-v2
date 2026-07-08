import { useEventsPage } from "@/features/events/hooks/useEventsPage";
import { HomePageContainer } from "@/features/home/components/HomePageContainer";
import { HomePageHeader } from "@/features/home/components/HomePageHeader";

export function HomePage() {
  const controller = useEventsPage();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <HomePageHeader displayName={controller.displayName} />
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-950">Mis eventos</h2>
      </div>
      <HomePageContainer controller={controller} />
    </section>
  );
}
