import Link from "next/link"

import { siteConfig } from "@/config/site"

export default function Guide({ city, recommendations = [] }) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl lg:pb-8 font-semibold">
        {city} City Guide
      </h1>

      <ul className="list-decimal list-inside lg:list-outside">
        {recommendations.map((item, index) => (
          <li key={index} className="mb-4">
            <h2 className="font-semibold inline-block">{item.title}</h2>
            <p>{item.description}</p>
            <Link
              className="text-blue-700 dark:text-blue-400 hover:underline"
              href={item.url}
            >
              {item.url}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 border border-gray-200 rounded-lg p-4 dark:border-slate-700 text-sm">
        <p className="italic">
          Limiting results to {siteConfig.resultCount} recommendations in order
          to keep API usage as well as the loading time to minimum. It is just
          an experiment.
        </p>
      </div>
    </div>
  )
}
