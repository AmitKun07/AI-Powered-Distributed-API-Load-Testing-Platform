import { useLocation } from "react-router-dom";
import { FiSearch, FiSettings } from "react-icons/fi";

function Topbar() {
  const { pathname } = useLocation();
  const page =
    pathname === "/load-test"
      ? "Load testing"
      : pathname === "/"
        ? "HTTP client"
        : "Workspace";

  return (
    <header className="flex h-11 items-center gap-4 px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 text-[13px]">
        <span className="truncate text-zinc-500">Workspace</span>
        <span className="text-zinc-700" aria-hidden>
          /
        </span>
        <span className="truncate font-medium text-zinc-200">{page}</span>
      </div>

      <div className="hidden max-w-md flex-1 md:block">
        <label className="relative block">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600">
            <FiSearch className="h-3.5 w-3.5" aria-hidden />
          </span>
          <input
            type="search"
            placeholder="Search…"
            className="h-8 w-full rounded-md border border-zinc-800/80 bg-zinc-900/50 py-1.5 pl-8 pr-3 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:border-sky-500/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span
          className="mr-2 hidden h-2 w-2 rounded-full bg-emerald-500/80 sm:inline-block"
          title="Connected"
          aria-label="Status: ready"
        />
        <button
          type="button"
          className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-300"
          aria-label="Settings"
        >
          <FiSettings className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-medium text-zinc-300 ring-1 ring-zinc-700/80"
          aria-label="Account"
        >
          A
        </button>
      </div>
    </header>
  );
}

export default Topbar;
