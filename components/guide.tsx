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
            <Link className="text-blue-700 hover:underline" href={item.url}>
              {item.url}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 border border-gray-200 rounded-lg p-4">
        <p className="italic text-md">
          Limiting results to {siteConfig.resultCount} recommendations... to
          keep API usage to minimum as it is just an experiment.
        </p>
      </div>
    </div>
  )
}
