import { z } from "zod"

import { siteConfig } from "@/config/site"

export const config = {
  runtime: "edge",
}

const schema = z.object({
  city: z.string().nonempty(),
  interests: z.array(z.string()).min(2),
  otherInterests: z.string().optional(),
})

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Invalid request method" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const body = (await req.json()) as {
    city: string
    interests: string[]
    otherInterests: string[]
  }

  console.log({ body })

  const response = schema.safeParse(body)

  if (!response.success)
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })

  const payload = {
    model: "text-davinci-003",
    prompt: generatePrompt(
      response.data.city,
      response.data.interests,
      response.data.otherInterests,
      siteConfig.resultCount
    ),
    temperature: 0.9,
    max_tokens: 1500,
    stream: false,
  }

  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  console.log({ data })

  const parsed = parseCityGuide(data.choices[0].text)
  console.log({ parsed })

  return new Response(JSON.stringify(parsed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

function generatePrompt(
  city,
  interests = [],
  otherInterests = "",
  resultCount
) {
  return `
    Create a personal city guide and recommend the ${resultCount} best places to visit in the city of ${city} based on your friend interests: ${interests.join(
    ", "
  )}. ${
    otherInterests.length
      ? `Please also take into account ${otherInterests}`
      : ""
  }.

The answer should match the following:
- Be valid JSON
- Not contain any line-breaks or enters
- Not contain an intro or ending, only the JSON data
- Limit amount of recommended places to ${resultCount}
- Be an array of places, where each place is represented as an object with the following key values: 
    - title: the title of the place
    - description: reason why one should visit the place in one sentence
    - url: website url of the place
  `
}

function parseCityGuide(data) {
  try {
    const text = data.replace("\n", "").trim()
    const startIndex = text.indexOf("[")
    const endIndex = text.lastIndexOf("]")
    const arrStr = text.substring(startIndex, endIndex + 1)
    return JSON.parse(arrStr)
  } catch (error) {
    console.log(error)
    return []
  }
}
