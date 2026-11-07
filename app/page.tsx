import { ArrowRight, Building2, UserRound, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const sections = [
  {
    title: "Players",
    href: "/players",
    icon: UsersRound,
    description:
      "Browse every player. Search by gamertag and filter by region, role or team. Open a player to see their profile and all hero ratings, sorted from S to F.",
  },
  {
    title: "Heroes",
    href: "/heroes",
    icon: UserRound,
    description:
      "All heroes grouped by Tank, Damage and Support. Click a hero to open a tier list of every player rated on that hero.",
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Building2,
    description:
      "Browse teams by name and competing region. Open a team to see its roster, and click a player to go to their page.",
  },
];

const steps = [
  "Watch an Overwatch esports match.",
  "Pay attention to how each player performs on the heroes they play.",
  "Rate them on those heroes from S (best) to F, based purely on what you feel.",
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-10 sm:gap-6 sm:pb-20">
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-ow-border/70 bg-ow-bg-deep/55 px-4 py-6 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:flex-row sm:gap-6 sm:rounded-3xl sm:px-8 sm:py-8">
        <div className="relative size-16 shrink-0 sm:size-20 lg:size-24">
          <Image
            src="/transparent_logo.png"
            alt="OWES logo"
            fill
            sizes="96px"
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ow-text/60 sm:tracking-[0.24em]">
            Overwatch Esport Scouting
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-ow-text sm:text-3xl lg:text-4xl">
            Watch esports with a scout&apos;s eye
          </h1>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-ow-text/75 sm:text-base">
            OWES lets you rate Overwatch esport players on the heroes they play
            while you watch. Ratings are entirely subjective. They reflect what
            you feel, not stats. The goal is a new way to watch Overwatch
            esports that makes you pay extra attention to every player.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-ow-border/70 bg-ow-bg-deep/55 px-4 py-5 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:rounded-3xl sm:px-8">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-ow-text sm:tracking-[0.3em]">
          How it works
        </h2>
        <ol className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-2xl border border-ow-border/70 bg-ow-bg-deep/30 px-4 py-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-ow-orange to-ow-orange-hot text-sm font-black text-ow-black">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-ow-text/85">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs font-medium text-ow-text/60">
          A player always has one main role, but can be rated on heroes from
          any role.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ title, href, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 rounded-2xl border border-ow-border/70 bg-ow-bg-deep/55 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-ow-orange/60 hover:shadow-[0_14px_28px_rgba(249,158,26,0.14)] focus-visible:border-ow-orange/60 focus-visible:outline-none sm:rounded-3xl sm:p-6 sm:last:col-span-2 md:last:col-span-1 lg:last:col-span-2 xl:last:col-span-1"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl border border-ow-border/60 bg-ow-bg-deep/40 text-ow-orange">
                <Icon className="size-5" />
              </span>
              <h2 className="text-lg font-black tracking-tight text-ow-text sm:text-xl">
                {title}
              </h2>
              <ArrowRight className="ml-auto size-5 text-ow-text/50 transition group-hover:translate-x-1 group-hover:text-ow-orange" />
            </div>
            <p className="text-sm font-medium leading-relaxed text-ow-text/75">
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
