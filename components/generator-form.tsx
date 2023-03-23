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

const tags = [
  "Sightseeing",
  "Art & Culture",
  "Shopping",
  "Food & Drink",
  "Nightlife",
  "Outdoor Activities",
  "Sports & Recreation",
  "Family-friendly",
  "Relaxation & Wellness",
  "Tours & Experiences",
  "Festivals & Events",
  "Budget-friendly",
  "Luxury",
  "Architecture",
  "History",
  "Off the beaten path",
] as const

const schema = z.object({
  city: z.string().nonempty("City is required"),
  otherSpecifications: z.string().optional(),
  tags: z.array(z.string()).min(2, "Select at least 2 interests"),
})

export default function GeneratorForm() {
  type SchemaType = z.infer<typeof schema>

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      tags: [],
    },
  })

  const onSubmit = (data) => {
    const otherSpecifications = data.otherSpecifications
      ? ` Also, consider these additional specifications: ${data.otherSpecifications}.`
      : ""

    const prompt = `Generate a personalized city guide for ${
      data.city
    } focusing on the following interests: ${data.tags.join(
      ", "
    )}. ${otherSpecifications}`

    console.log("Generated prompt:", prompt)
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
        />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>
      <div className="mb-10">
        <Label>Select your interests:</Label>
        <div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pb-3">
            {tags.map((tag) => (
              <div key={tag} className="items-top flex space-x-2">
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        id={`tags.${tag}`}
                        name="tags"
                        onCheckedChange={(value) => {
                          const values = getValues("tags")
                          if (value && !values.includes(tag)) {
                            field.onChange([...values, tag])
                          } else {
                            field.onChange(values.filter((t) => t !== tag))
                          }
                        }}
                      />
                    )
                  }}
                />
                <label
                  htmlFor={`tags.${tag}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
          {errors && errors.tags && (
            <p className="text-red-500 text-sm">{errors.tags.message}</p>
          )}
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5 mb-10">
        <Label htmlFor="otherSpecifications">Any other specifications:</Label>
        <Textarea
          {...register("otherSpecifications")}
          id="otherSpecifications"
          name="otherSpecifications"
          rows={4}
          maxLength={200}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full md:inline-flex md:w-auto"
      >
        {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
        Generate
      </Button>
    </form>
  )
}
