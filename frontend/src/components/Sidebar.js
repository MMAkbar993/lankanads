import { cookies } from "next/headers";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    return <SidebarClient initialIsLoggedIn={Boolean(token)} />;
}