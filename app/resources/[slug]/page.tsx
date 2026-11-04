import { notFound } from "next/navigation";
import { REG, TITLES } from "@/components/pages/_registry_resources";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(REG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: TITLES[slug] };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const load = REG[slug];
  if (!load) notFound();
  const C = (await load()).default;
  return <C />;
}
