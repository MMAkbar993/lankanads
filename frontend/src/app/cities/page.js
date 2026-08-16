"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Home,
  Lightbulb,
  MapPin,
  Search,
  Shield,
} from "lucide-react";

const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const BUILDING_HEIGHTS = [
  42, 76, 54, 95, 64, 122, 78, 105, 58, 88, 136, 72, 110, 62, 92, 52, 84, 124,
  68, 98,
];

export default function CitiesPage() {
  const [search, setSearch] = useState("");

  const filteredDistricts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return DISTRICTS;
    }

    return DISTRICTS.filter((district) =>
      district.toLowerCase().includes(searchValue)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1530px]">
        <Breadcrumb />

        <section className="relative mt-4 min-h-[210px] overflow-hidden rounded-2xl bg-[#050507] px-6 py-8 text-white shadow-sm sm:px-8 lg:px-10">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_40%,rgba(190,0,52,0.30),transparent_40%),linear-gradient(90deg,#020203_0%,#090005_48%,#160009_100%)]" />
          <div className="absolute inset-y-0 right-0 w-full opacity-95 sm:w-[63%]">
            <div
              className="absolute inset-0  bg-right-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/how-to-post-banner.png')",
                backgroundSize: "60% 100%",
                backgroundPositionX: "100%",
              }}
            />
          </div>

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="relative z-10 flex min-h-[145px] items-center">
            <div className="flex max-w-[660px] items-start gap-5">
              <div className="relative mt-1 hidden h-[76px] w-[66px] shrink-0 items-center justify-center sm:flex">
                <Shield
                  className="absolute h-full w-full text-[#ff0f68]"
                  strokeWidth={1.8}
                />

                <MapPin
                  className="relative h-8 w-8 text-[#ff0f68]"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Cities
                </h1>

                <p className="mt-3 max-w-[590px] text-sm leading-6 text-white/80 sm:text-base">
                  Browse ads by district across Sri Lanka. Click a city to view
                  related advertisements.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
                  <CalendarDays className="h-5 w-5" />

                  <span>
                    <strong className="text-[#ff0f68]">
                      {DISTRICTS.length}
                    </strong>{" "}
                    districts available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-2xl bg-white p-5 shadow-[0_2px_18px_rgba(0,0,0,0.03)] sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <h2 className="text-lg font-extrabold text-[#17171b]">
                Select a city to filter ads instantly.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#56565f] sm:text-base">
                Click any city below to view relevant advertisements.
              </p>
            </div>

            <div className="lg:col-span-4">
              <label htmlFor="district-search" className="sr-only">
                Search district
              </label>

              <div className="flex h-12 items-center gap-3 rounded-lg border border-[#f4bbcf] bg-white px-4 transition focus-within:border-[#ff0f68] focus-within:ring-2 focus-within:ring-[#ff0f68]/10">
                <Search className="h-5 w-5 shrink-0 text-[#7a7a82]" />

                <input
                  id="district-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search district or city..."
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#202026] outline-none placeholder:text-[#92929a]"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#ffd0df] bg-[#fff6f9] p-5 lg:col-span-3">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 shrink-0 text-[#ff0f68]" />

                <h3 className="font-extrabold text-[#ff0f68]">How it works</h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#424249]">
                When a city is clicked, the website will search and filter ads
                for that city.
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDistricts.map((district) => (
              <DistrictCard key={district} district={district} />
            ))}
          </div>

          {filteredDistricts.length === 0 && (
            <div className="mt-8 rounded-xl border border-dashed border-[#e3e3e7] px-5 py-12 text-center">
              <MapPin className="mx-auto h-9 w-9 text-[#ff0f68]" />

              <h3 className="mt-3 text-lg font-bold text-[#202026]">
                No district found
              </h3>

              <p className="mt-1 text-sm text-[#73737c]">
                Try searching with another district name.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm font-medium"
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-[#ff0f68] transition hover:text-[#d90057]"
      >
        <Home className="h-4 w-4 fill-current" />
        <span>Home</span>
      </Link>

      <ChevronRight className="h-4 w-4 text-[#b5b5bb]" />

      <span className="font-semibold text-[#ff0f68]">Cities</span>
    </nav>
  );
}

function DistrictCard({ district }) {
  return (
    <Link
      href={{
        pathname: "/",
        query: {
          location: district,
        },
      }}
      className="group flex min-h-[64px] items-center justify-between rounded-xl border border-[#e7e7eb] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition duration-200 hover:-translate-y-0.5 hover:border-[#ff0f68]/40 hover:shadow-[0_8px_25px_rgba(255,15,104,0.10)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <MapPin className="h-6 w-6 shrink-0 text-[#ff0f68]" strokeWidth={2} />

        <span className="truncate text-sm font-bold text-[#202026] sm:text-base">
          {district}
        </span>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-[#ff0f68] transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

function CitySkyline() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[190px] w-[58%] overflow-hidden md:block">
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#ff0f68]/30 to-transparent" />

      <div className="absolute bottom-0 right-0 flex h-full w-[88%] items-end justify-end gap-[5px] opacity-55">
        {BUILDING_HEIGHTS.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className="relative w-[22px] border-x border-t border-[#ff0f68]/50 bg-[#ff0f68]/25"
            style={{ height }}
          >
            <div
              className="absolute inset-1 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #ff5b95 0 2px, transparent 2px 8px)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-[38%] h-[178px] w-12">
        <div className="absolute bottom-0 left-1/2 h-[132px] w-7 -translate-x-1/2 bg-gradient-to-t from-[#ff0f68]/55 to-[#ff0f68]/25" />

        <div className="absolute bottom-[128px] left-1/2 h-7 w-10 -translate-x-1/2 rounded-[50%] border border-[#ff0f68]/70 bg-[#ff0f68]/35" />

        <div className="absolute bottom-[151px] left-1/2 h-7 w-3 -translate-x-1/2 bg-[#ff0f68]/45" />

        <div className="absolute bottom-[174px] left-1/2 h-5 w-[2px] -translate-x-1/2 bg-[#ff0f68]" />
      </div>

      <div className="absolute bottom-0 left-[3%] right-0 h-px bg-[#ff0f68]/50 shadow-[0_0_20px_6px_rgba(255,15,104,0.2)]" />
    </div>
  );
}
