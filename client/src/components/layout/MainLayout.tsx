import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* Navbar - full width at top */}
      <Navbar />

      {/* Below navbar: sidebar + content side by side */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#1a1a1a] p-4">
          {children}
        </main>

      </div>
    </div>
  )
}