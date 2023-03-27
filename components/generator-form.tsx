import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

const interests = [
  "Museums",
  "Galeries",
  "Music Venues",
  "Theater",
  "Markets",
  "Boutiques",
  "Local Cuisine",
  "Fine Dining",
  "Street Food",
  "Cafes",
  "Bars & Pubs",
  "Breweries & Distilleries",
  "Clubs",
  "Off the beaten path",
] as const

const schema = z.object({
  city: z.string().nonempty("City is required"),
  interests: z.array(z.string()).min(2, "Select at least 2 interests"),
  otherInterests: z.string().optional(),
})

export default function GeneratorForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: (city: string, data: any) => void
}) {
  type SchemaType = z.infer<typeof schema>

  const {
    control,
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      interests: [],
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: data.city,
          interests: data.interests,
          otherInterests: data.otherInterests,
        }),
      })

      if (response.ok) {
        const json = await response.json()
        onSubmitSuccess(data.city, json.data)
        return
      }

      setError("root.serverError", {
        type: response.status.toString(),
        message: response.statusText,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="city">City:</Label>
        <Input
          {...register("city", { required: true })}
          type="text"
          id="city"
          name="city"
          maxLength={30}
        />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>
      <div className="mb-10">
        <Label>Select your interests:</Label>
        <div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pb-3">
            {interests.map((interest) => (
              <div key={interest} className="items-top flex space-x-2">
                <Controller
                  name="interests"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        id={`interests.${interest}`}
                        name="interests"
                        onCheckedChange={(value) => {
                          const values = getValues("interests")
                          if (value && !values.includes(interest)) {
                            field.onChange([...values, interest])
                          } else {
                            field.onChange(values.filter((t) => t !== interest))
                          }
                        }}
                      />
                    )
                  }}
                />
                <label
                  htmlFor={`interests.${interest}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {interest}
                </label>
              </div>
            ))}
          </div>
          {errors && errors.interests && (
            <p className="text-red-500 text-sm">{errors.interests.message}</p>
          )}
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="otherInterests">Any other interests:</Label>
        <Textarea
          {...register("otherInterests")}
          id="otherInterests"
          name="otherInterests"
          rows={4}
          maxLength={100}
        />
      </div>
      {errors.root?.serverError && (
        <div className="mb-6">
          <p className="text-red-500 text-sm">
            Error: {errors.root.serverError.message}
          </p>
        </div>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full md:inline-flex md:w-auto"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate
      </Button>
    </form>
  )
}
