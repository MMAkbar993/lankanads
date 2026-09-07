import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta({
    title: "Top Ads Agents in Sri Lanka | Connect With Local Ad Agents",
    description:
        "Looking for the Top Ads Agents in Sri Lanka? LankaNads provides a directory to discover reliable Local Ad Agents and Online Ads Agents. Contact now!",
    path: "/agents",
});

export default function AgentsLayout({ children }) {
    return children;
}
