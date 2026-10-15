import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="h-12 w-12 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold font-mono text-zinc-100">404 - Page Not Found</h2>
      <p className="text-xs text-zinc-400 max-w-md">
        The requested control plane resource or route does not exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-all shadow-hairline"
      >
        Return to Overview Dashboard
      </Link>
    </div>
  );
}
