import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset:   import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:    false,
  token:     import.meta.env.SANITY_TOKEN,
});

export type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  category: string;
  coverImage?: { asset: { url: string }; alt?: string };
  body: any[];
  author?: string;
};

export async function getAllPosts(): Promise<Post[]> {
  return sanityClient.fetch(`
    *[_type == "post" && isDraft != true] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, category, author,
      coverImage { asset->{ url }, alt }
    }
  `);
}

export type Broker = {
  _id: string;
  name: string;
  slug: { current: string };
  logo?: { asset: { url: string }; alt?: string };
  affiliateLink?: string;
  tagline?: string;
  rating?: number;
  cashbackRate?: string;
  minDeposit?: string;
  spread?: string;
  leverage?: string;
  regulation?: string;
  pros?: string[];
  cons?: string[];
  featured?: boolean;
  order?: number;
  body?: any[];
};

export async function getAllBrokers(): Promise<Broker[]> {
  return sanityClient.fetch(`
    *[_type == "broker"] | order(featured desc, order asc, name asc) {
      _id, name, slug, tagline, rating, cashbackRate, minDeposit,
      spread, leverage, regulation, pros, cons, featured, order, affiliateLink,
      logo { asset->{ url }, alt }
    }
  `);
}

export async function getBrokerBySlug(slug: string): Promise<Broker | null> {
  return sanityClient.fetch(`
    *[_type == "broker" && slug.current == $slug][0] {
      _id, name, slug, tagline, rating, cashbackRate, minDeposit,
      spread, leverage, regulation, pros, cons, featured, affiliateLink,
      logo { asset->{ url }, alt },
      body
    }
  `, { slug });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, publishedAt, category, author,
      coverImage { asset->{ url }, alt },
      body
    }
  `, { slug });
}
