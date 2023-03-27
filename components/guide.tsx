import Link from "next/link"

export default function Guide({ city, recommendations = [] }) {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-8">{city} City Guide</h1>

      <ul className="list-decimal">
        {recommendations.map((item, index) => (
          <li key={index} className="mb-4">
            <h2 className="font-semibold">{item.title}</h2>
            <p>{item.description}</p>
            <Link className="text-blue-700 hover:underline" href={item.url}>
              {item.url}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 italic">
        Limiting it to 5 recommendations... to keep API usage to minimum as it
        is just an experiment.
      </p>
    </div>
  )
}
