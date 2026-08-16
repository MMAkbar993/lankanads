import Sidebar from "@/components/Sidebar";
import Header from "@/Header/Header";
import Footer from "@/Footer/Footer";
import Banner from "@/components/Banner/Banner";
import ConditionalTopCategory from "@/components/ConditionalTopCategory";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* <Header /> */}
            <Banner />
            <ConditionalTopCategory />

            <main className="mx-auto w-full px-0 lg:px-6 py-0 lg:py-10 flex gap-8">
                <aside className="hidden lg:block">
                    <Sidebar />
                </aside>

                <div className="flex-1 rounded-md bg-slate-100 p-6">
                    {children}
                </div>
            </main>

            {/* <Footer /> */}
        </div>
    );
}