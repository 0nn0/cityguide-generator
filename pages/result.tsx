import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"

import Guide from "@/components/guide"
import { Layout } from "@/components/layout"

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const

type StatusKeys = keyof typeof STATUS
type StatusValues = (typeof STATUS)[StatusKeys]

export default function Result() {
  const [status, setStatus] = useState<StatusValues>(STATUS.LOADING)
  const [storedValue, setValue] = useState(null)

  useEffect(() => {
    function checkUserData() {
      const item = window.localStorage.getItem("recommendations")

      if (item) {
        setValue(JSON.parse(item))
        setStatus(STATUS.SUCCESS)
      }
    }

    checkUserData()
  }, [])

  return (
    <Layout>
      <Head>
        <title>Your City Guide</title>
        <meta
          name="description"
          content="Next.js template for building apps with Radix UI and Tailwind CSS"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="container grid items-center gap-6 py-12 md:py-10">
          {status === STATUS.LOADING && <div>Loading...</div>}
          {status === STATUS.ERROR && (
            <div>
              Something went wrong.{" "}
              <Link href="/" className="text-blue-700 underline">
                Please try again...
              </Link>
            </div>
          )}

          {status === STATUS.SUCCESS && (
            <Guide
              city={storedValue.city}
              recommendations={storedValue.recommendations}
            />
          )}
        </section>
      </main>
    </Layout>
  )
}
