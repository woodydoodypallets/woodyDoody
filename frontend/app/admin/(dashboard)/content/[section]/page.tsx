import { notFound } from "next/navigation";
import ContentManager from "@/components/admin/ContentManager";
import type { ContentSection } from "@/lib/api";

const VALID_SECTIONS: ContentSection[] = [
  "service", "industry", "faq", "product", "gallery", "testimonial", "nav_item", "footer_link", "office_location",
];

export default async function AdminContentSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!VALID_SECTIONS.includes(section as ContentSection)) {
    notFound();
  }
  return <ContentManager section={section as ContentSection} />;
}
