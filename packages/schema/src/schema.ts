import * as z from "zod";

export const testSchema = z
  .object({
    num: z.number(),
    str: z.string(),
  })
  .required();

export type TestSchema = z.infer<typeof testSchema>;
