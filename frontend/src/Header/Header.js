import { cookies } from "next/headers";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    return <HeaderClient initialIsLoggedIn={Boolean(token)} />;
}