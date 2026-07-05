import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hafizstore.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // TODO: Fetch dynamic product and category URLs from Supabase
  // const products = await supabase.from("products").select("slug, updated_at");
  // const categories = await supabase.from("categories").select("slug, updated_at");

  // const productUrls: MetadataRoute.Sitemap =
  //   products?.data?.map((product) => ({
  //     url: `${BASE_URL}/products/${product.slug}`,
  //     lastModified: new Date(product.updated_at),
  //     changeFrequency: "weekly",
  //     priority: 0.7,
  //   })) ?? [];

  // const categoryUrls: MetadataRoute.Sitemap =
  //   categories?.data?.map((category) => ({
  //     url: `${BASE_URL}/categories/${category.slug}`,
  //     lastModified: new Date(category.updated_at),
  //     changeFrequency: "weekly",
  //     priority: 0.6,
  //   })) ?? [];

  return [...staticPages];
}
