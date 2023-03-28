import Head from "next/head"
import { useRouter } from "next/router"
import { useLocalStorage } from "usehooks-ts"

import GeneratorForm from "@/components/generator-form"
import { Layout } from "@/components/layout"

export default function IndexPage() {
  const router = useRouter()
  const [storedValue, setValue] = useLocalStorage("recommendations", null)

  return (
    <Layout>
      <Head>
        <title>City Guide Generator</title>
        <meta
          name="description"
          content="Discover the best hotspots with our city guide generator. It creates a unique itinerary based on your interests and preferences. From hidden gems to popular attractions, explore the city like a local."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="container grid items-center gap-6 py-12 md:py-10">
          <h1 className="text-2xl lg:text-3xl lg:pb-4 font-semibold">
            Generate your city guide
          </h1>
          <GeneratorForm
            onSubmitSuccess={(city, recommendations) => {
              setValue({
                city,
                recommendations,
              })
              router.push("/result")
            }}
          />
        </section>
      </main>
    </Layout>
  )
}
