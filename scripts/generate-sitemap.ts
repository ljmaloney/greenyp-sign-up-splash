import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://greenyp.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

async function fetchCategories(): Promise<{ urlLob: string; lineOfBusinessId: string }[]> {
  try {
    const response = await fetch("https://services.greenyp.com/reference/lob");
    if (!response.ok) return [];
    const data = await response.json();
    const categories = data.response || data;
    if (!Array.isArray(categories)) return [];
    return categories.map((c: any) => ({
      urlLob: c.urlLob,
      lineOfBusinessId: c.lineOfBusinessId,
    }));
  } catch {
    return [];
  }
}

async function fetchClassifiedCategories(): Promise<{ urlName: string }[]> {
  try {
    const response = await fetch("https://services.greenyp.com/reference/classified/categories");
    if (!response.ok) return [];
    const data = await response.json();
    const categories = data.response || data;
    if (!Array.isArray(categories)) return [];
    return categories
      .filter((c: any) => c.urlName)
      .map((c: any) => ({ urlName: c.urlName }));
  } catch {
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const today = new Date().toISOString().split("T")[0];

  const staticEntries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/terms", changefreq: "monthly", priority: "0.3" },
    { path: "/privacy", changefreq: "monthly", priority: "0.3" },
    { path: "/cookies", changefreq: "monthly", priority: "0.3" },
    { path: "/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/search", changefreq: "weekly", priority: "0.6" },
    { path: "/categories", changefreq: "weekly", priority: "0.8" },
    { path: "/classifieds", changefreq: "daily", priority: "0.7" },
    { path: "/classifieds/samples", changefreq: "weekly", priority: "0.5" },
    { path: "/classifieds/categories", changefreq: "weekly", priority: "0.6" },
    { path: "/classifieds/create", changefreq: "monthly", priority: "0.4" },
    { path: "/subscribers", changefreq: "weekly", priority: "0.8" },
    { path: "/subscribers/about", changefreq: "monthly", priority: "0.5" },
    { path: "/subscribers/signup", changefreq: "monthly", priority: "0.7" },
    { path: "/subscribers/subscribe", changefreq: "monthly", priority: "0.7" },
    { path: "/subscribers/subscription-features", changefreq: "monthly", priority: "0.6" },
    { path: "/subscribers/pricing", changefreq: "monthly", priority: "0.7" },
    { path: "/subscribers/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/subscribers/categories", changefreq: "weekly", priority: "0.7" },
  ];

  // Add lastmod to all static entries
  staticEntries.forEach((e) => {
    e.lastmod = today;
  });

  const categories = await fetchCategories();
  const categoryEntries: SitemapEntry[] = categories.map((cat) => ({
    path: `/categories/${cat.urlLob}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.6",
  }));

  const altCategoryEntries: SitemapEntry[] = categories.map((cat) => ({
    path: `/category/${cat.lineOfBusinessId}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.5",
  }));

  const subscriberCategoryEntries: SitemapEntry[] = categories.map((cat) => ({
    path: `/subscribers/categories/${cat.urlLob}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.6",
  }));

  const classifiedCategories = await fetchClassifiedCategories();
  const classifiedCategoryEntries: SitemapEntry[] = classifiedCategories.map((cat) => ({
    path: `/classifieds/${cat.urlName}`,
    lastmod: today,
    changefreq: "daily",
    priority: "0.6",
  }));

  const allEntries = [
    ...staticEntries,
    ...categoryEntries,
    ...altCategoryEntries,
    ...subscriberCategoryEntries,
    ...classifiedCategoryEntries,
  ];

  const sitemap = generateSitemap(allEntries);
  writeFileSync(resolve("public/sitemap.xml"), sitemap);
  console.log(`sitemap.xml written (${allEntries.length} entries)`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
