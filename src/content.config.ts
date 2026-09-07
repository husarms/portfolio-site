import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    thumbnailImage: z.union([image(), z.string()]).optional(),
    thumbnailImagePosition: z.enum(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).default('center').optional(),
    tags: z.array(z.string()).default([]),
    destination: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    gallery: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
