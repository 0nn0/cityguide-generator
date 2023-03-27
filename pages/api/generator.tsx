import type { NextApiRequest, NextApiResponse } from "next"
import { Configuration, OpenAIApi } from "openai"
import { z } from "zod"

const schema = z.object({
  city: z.string().nonempty(),
  interests: z.array(z.string()).min(2),
  otherInterests: z.string().optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const response = schema.safeParse(req.body)

    if (!response.success)
      return res.status(400).json({
        error: "Invalid request body",
      })

    const openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      })
    )

    const data = response.data

    try {
      const prompt = generatePrompt(
        data.city,
        data.interests,
        data.otherInterests
      )

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.9,
        max_tokens: 1500,
        stream: false,
      })

      if (completion.data.choices[0].finish_reason === "stop") {
        const parsed = parseCityGuide(completion.data.choices[0].text)

        return res.status(200).json({
          data: parsed,
        })
      }
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data)
      } else {
        return res.status(500).json({
          error: {
            message: "An error occurred during your request.",
          },
        })
      }
    }

    return res.status(204).json({})
  }

  return res.status(405).json({
    error: "Method not allowed",
  })
}

function generatePrompt(city, interests = [], otherInterests = "") {
  return `
    Create a city guide and recommend me the 5 best places I should in the city of ${city} based on my interests: ${interests.join(
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
