import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-t-slate-200 py-6">
      <div className="container flex">
        <div className="flex flex-col items-center space-y-4 dark:border-b-slate-700">
          <div className="">
            <p className="text-sm">
              Little experiment built by{" "}
              <Link
                href="https://www.onnoschwanen.com"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm"
              >
                0nn0
              </Link>{" "}
              with{" "}
              <Link
                href="https://nextjs.org"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm"
              >
                Next.js
              </Link>
              ,{" "}
              <Link
                href="https://ui.shadcn.com"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm"
              >
                Shadcn
              </Link>{" "}
              &{" "}
              <Link
                href="https://openai.com"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm"
              >
                ChatGPT
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
