import Link from "next/link";

/* =========================
   ICONS
========================= */

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 10.7 12 3l9 7.7v9.8a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TagIcon(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 28 28 5h23a8 8 0 0 1 8 8v23L36 59a8 8 0 0 1-11 0L5 39a8 8 0 0 1 0-11Z"
        stroke="currentColor"
        strokeWidth="3"
      />

      <circle cx="45" cy="19" r="4" stroke="currentColor" strokeWidth="3" />

      <circle cx="31" cy="32" r="10" stroke="currentColor" strokeWidth="3" />

      <path
        d="M28 27.5h3.7c2.1 0 3.8 1.5 3.8 3.4 0 1.9-1.7 3.4-3.8 3.4H28m0-6.8v9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CrownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m3 7 4.7 4L12 4l4.3 7L21 7l-2 11H5L3 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M5 21h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 8h2m4 0h2M8 12h2m4 0h2M8 16h2m4 0h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />

      <path
        d="m8 12.2 2.3 2.3L16.4 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3 9.7 8.7 4 11l5.7 2.3L12 19l2.3-5.7L20 11l-5.7-2.3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m5 3-.8 2L2 6l2.2.9L5 9l.8-2.1L8 6l-2.2-1L5 3Zm14 13-.8 2.1-2.2.9 2.2.9L19 22l.8-2.1L22 19l-2.2-.9L19 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WarningIcon(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M28 9.5 5.5 48.5A6 6 0 0 0 10.7 57h42.6a6 6 0 0 0 5.2-8.5L36 9.5a4.6 4.6 0 0 0-8 0Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d="M32 22v16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle cx="32" cy="46" r="2.7" fill="currentColor" />
    </svg>
  );
}

function MegaphoneIcon(props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M15 29v12h10l23 11V18L25 29H15Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M25 41 31 55H20l-5-14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M53 25 59 19m-6 20 8 2m-8-9h9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================
   PRICING DATA
========================= */

const plans = [
  {
    id: "vip",
    name: "VIP Ad",
    price: "LKR 8,000",
    badge: "VIP",
    accent: "#F29A00",
    border: "#F1D18F",
    icon: <CrownIcon className="h-5 w-5" />,
    features: [
      "24 Hours Premium Placement",
      "Top priority above all ads",
      "Shows on homepage and category pages",
      "After 24 hours continues as a normal ad",
      "Total visibility: 30 days",
    ],
  },
  {
    id: "super",
    name: "Super Ad",
    price: "LKR 1,500",
    badge: "SUPER",
    accent: "#ED145B",
    border: "#F2D5DE",
    icon: <StarIcon className="h-5 w-5" />,
    features: [
      "24 Hours Premium Placement",
      "Shows after VIP ads and before Normal ads",
      "Homepage and category page visibility",
      "After 24 hours continues as a normal ad",
      "Total visibility: 30 days",
    ],
  },
  {
    id: "normal",
    name: "Normal Ad",
    price: "LKR 500",
    badge: "NORMAL",
    accent: "#3B3B3D",
    border: "#D9DDE2",
    icon: <GridIcon className="h-5 w-5" />,
    features: [
      "Standard ad placement",
      "Shows after active VIP and Super ads",
      "Visible on homepage and category pages",
      "Total visibility: 30 days",
    ],
  },
];

const comparisonRows = [
  ["Price", "LKR 8,000", "LKR 1,500", "LKR 500"],
  ["Premium Placement", "24 Hours", "24 Hours", "No"],
  ["Priority", "Highest (Above all ads)", "Second (After VIP ads)", "Standard"],
  ["Homepage Visibility", "Yes (24 hours)", "Yes (24 hours)", "Yes (Standard)"],
  [
    "Category Page Visibility",
    "Yes (24 hours)",
    "Yes (24 hours)",
    "Yes (Standard)",
  ],
  ["Total Visibility", "30 Days", "30 Days", "30 Days"],
];

/* =========================
   PRICING CARD
========================= */

function PlanCard({ plan }) {
  const isNormal = plan.id === "normal";

  return (
    <article
      className="flex h-full flex-col rounded-xl border bg-white px-5 pb-5 pt-4 shadow-[0_1px_6px_rgba(15,23,42,0.035)] sm:px-6"
      style={{
        borderColor: plan.border,
      }}
    >
      <div className="flex items-center justify-center gap-2.5">
        <span style={{ color: plan.accent }}>{plan.icon}</span>

        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white"
          style={{
            backgroundColor: plan.accent,
          }}
        >
          {plan.badge}
        </span>
      </div>

      <h2 className="mt-3 text-center text-[18px] font-semibold leading-tight text-[#202124]">
        {plan.name}
      </h2>

      <p
        className="mt-2 text-center text-[21px] font-bold leading-tight sm:text-[22px]"
        style={{
          color: plan.accent,
        }}
      >
        {plan.price}
      </p>

      <div
        className="my-4 h-px w-full"
        style={{
          backgroundColor: plan.accent,
        }}
      />

      <ul className="flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[13px] font-normal leading-[1.45] text-[#2D2E32]"
          >
            <CheckCircleIcon
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{
                color: plan.accent,
              }}
            />

            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/portal/new-ad?package=${plan.id}`}
        className="mt-6 flex h-10 items-center justify-center rounded-md border text-[13px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
        style={
          isNormal
            ? {
                backgroundColor: "#FFFFFF",
                borderColor: "#ED145B",
                color: "#ED145B",
              }
            : {
                backgroundColor: plan.accent,
                borderColor: plan.accent,
                color: "#FFFFFF",
              }
        }
      >
        Choose {plan.name.replace(" Ad", "")}
      </Link>
    </article>
  );
}

/* =========================
   PAGE
========================= */

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white pb-7 font-sans text-[#202124]">
      <div className="mx-auto w-full max-w-[1366px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}

        <nav
          aria-label="Breadcrumb"
          className="flex h-11 items-center gap-2.5 text-[12px] font-medium"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-[#ED145B] transition hover:opacity-75"
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

          <span className="text-[#B8BBC2]">›</span>

          <span className="text-[#ED145B]">Pricing Plans</span>
        </nav>
        {/* Header Banner */}
        <section className="relative isolate overflow-hidden rounded-xl bg-[#050506] shadow-sm">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_40%,rgba(190,0,52,0.30),transparent_40%),linear-gradient(90deg,#020203_0%,#090005_48%,#160009_100%)]" />
          <div className="absolute inset-y-0 right-0 w-full opacity-95 sm:w-[63%]">
            <div
              className="absolute inset-0  bg-right-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/how-to-post-banner.png')",
                backgroundSize:"60% 100%",
                backgroundPositionX:"100%"
              }}
            />
          </div>

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />

     

          <div className="relative z-10 flex min-h-[165px] items-center gap-4 px-5 py-6 sm:px-8 sm:py-7 lg:px-9">
            <TagIcon className="hidden h-16 w-16 shrink-0 text-[#ED145B] sm:block" />

            <div>
              <h1 className="text-[27px] font-bold tracking-[-0.02em] text-white sm:text-[31px] lg:text-[33px]">
                Pricing Plans
              </h1>

              <p className="mt-1.5 text-[12px] font-normal leading-5 text-white/85 sm:text-[13px]">
                Choose the right ad package to promote your advertisement on
                LankanAdsLK.
              </p>

              <p className="mt-3 flex items-center gap-2 text-[12px] font-normal text-white/80 sm:text-[13px]">
                <SparkIcon className="h-4 w-4 text-white/80" />
                Premium visibility options for ads across Sri Lanka.
              </p>
            </div>
          </div>
        </section>
        {/* Pricing Cards */}

        <section className="mt-4 grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </section>

        {/* Comparison Table */}

        <section className="mt-4 rounded-xl border border-[#E2E4E8] bg-white p-3.5 shadow-[0_1px_6px_rgba(15,23,42,0.025)] sm:p-4">
          <h2 className="mb-2.5 text-[17px] font-semibold text-[#202124]">
            Package Comparison
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#DDE0E5]">
            <table className="w-full min-w-[820px] border-collapse text-[12px] sm:text-[12.5px]">
              <thead className="bg-gradient-to-b from-[#FAFAFB] to-[#F1F2F4]">
                <tr>
                  <th className="w-[25%] border-b border-r border-[#E1E3E7] px-3.5 py-2.5 text-left font-semibold">
                    Feature
                  </th>

                  <th className="border-b border-r border-[#E1E3E7] px-3.5 py-2.5 text-center font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <CrownIcon className="h-5 w-5 text-[#F29A00]" />
                      VIP Ad
                    </span>
                  </th>

                  <th className="border-b border-r border-[#E1E3E7] px-3.5 py-2.5 text-center font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-[#ED145B]" />
                      Super Ad
                    </span>
                  </th>

                  <th className="border-b border-[#E1E3E7] px-3.5 py-2.5 text-center font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <GridIcon className="h-5 w-5 text-[#3B3B3D]" />
                      Normal Ad
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row, rowIndex) => (
                  <tr
                    key={row[0]}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#FCFCFD]"}
                  >
                    <th className="border-b border-r border-[#E8E9EC] px-3.5 py-2 text-left font-semibold">
                      {row[0]}
                    </th>

                    <td
                      className={`border-b border-r border-[#E8E9EC] px-3.5 py-2 text-center font-normal ${
                        rowIndex === 0 ? "font-semibold text-[#F29A00]" : ""
                      }`}
                    >
                      {row[1]}
                    </td>

                    <td
                      className={`border-b border-r border-[#E8E9EC] px-3.5 py-2 text-center font-normal ${
                        rowIndex === 0 ? "font-semibold text-[#ED145B]" : ""
                      }`}
                    >
                      {row[2]}
                    </td>

                    <td
                      className={`border-b border-[#E8E9EC] px-3.5 py-2 text-center font-normal ${
                        rowIndex === 0 ? "font-semibold text-[#222326]" : ""
                      }`}
                    >
                      {row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Important Note */}

        <section className="mt-4 flex gap-3 rounded-xl border border-[#ED145B] bg-[#FFF7FA] px-4 py-4 sm:items-center sm:px-5">
          <WarningIcon className="h-9 w-9 shrink-0 text-[#ED145B] sm:h-10 sm:w-10" />

          <div>
            <h2 className="text-[14px] font-semibold text-[#ED145B] sm:text-[15px]">
              Important Note
            </h2>

            <p className="mt-1 max-w-[1180px] text-[12px] font-normal leading-[1.5] text-[#34353A] sm:text-[13px]">
              VIP and Super ads receive premium placement for the first 24 hours
              only. After the 24-hour premium period ends, the ad is not deleted
              — it continues as a normal ad until the 30-day visibility period
              ends.
            </p>
          </div>
        </section>

        {/* Bottom Banner */}

        <section className="relative isolate mt-4 overflow-hidden rounded-xl bg-[#050506] px-5 py-6 sm:px-8 lg:min-h-[165px] lg:px-9">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_50%,rgba(210,0,57,0.26),transparent_38%),linear-gradient(90deg,#020203_0%,#080004_50%,#160009_100%)]" />

          <div
            className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-cover bg-right bg-no-repeat opacity-95 md:block"
            style={{
              backgroundImage: "url('/pricing/pricing-boost-skyline.png')",
            }}
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-transparent" />

          <div className="flex max-w-[720px] items-center gap-5">
            <div className="relative hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#ED145B]/70 sm:flex">
              <div className="absolute inset-3 rounded-full border border-dashed border-[#ED145B]/70" />

              <MegaphoneIcon className="h-10 w-10 text-[#ED145B]" />
            </div>

            <div>
              <h2 className="text-[25px] font-bold tracking-[-0.02em] text-white sm:text-[29px] lg:text-[31px]">
                Boost Your Ad Visibility
              </h2>

              <p className="mt-1.5 max-w-[570px] text-[12px] font-normal leading-5 text-white/85 sm:text-[13px]">
                Choose VIP, Super, or Normal Ads to get more exposure, reach
                more people, and grow your impact across Sri Lanka.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/portal"
                  className="flex h-10 min-w-[165px] items-center justify-center rounded-md bg-[#ED145B] px-5 text-[13px] font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#D10F50]"
                >
                  Post Your Ad Now
                </Link>

                <Link
                  href="/post-ad"
                  className="flex h-10 min-w-[165px] items-center justify-center rounded-md border border-[#ED145B] px-5 text-[13px] font-semibold text-[#ED145B] transition duration-200 hover:bg-[#ED145B]/10"
                >
                  How to Post
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
