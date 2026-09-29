'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatDate } from '@/shared/utils/utils';
import { GithubRepoPreview } from '@/modules/resources/components/GithubRepoPreview';
import { GithubStatsCard } from '@/modules/resources/components/GithubStatsCard';
import { TrustedBySection } from '@/modules/resources/components/TrustedBySection';
import { useLanguage } from '@/shared/ui/i18n';
import { parseGithubRepoUrl } from '@/modules/resources/infrastructure/github/parseGithubRepoUrl';
import type { GithubRepoPreview as GithubRepoPreviewData, Resource } from '@/types/resource';
import { ResourcePreview } from '@/modules/resources/components/ResourcePreview';
import { RelatedResources } from '@/modules/resources/components/RelatedResources';
import { CommentSection } from '@/modules/resources/components/CommentSection';
import { usePreview } from '@/hooks/usePreview';
import { ResourceCtaBanner } from '@/modules/resources/components/ResourceCtaBanner';
import { ResourcePhotoCarousel } from '@/modules/resources/components/ResourcePhotoCarousel';
import { getSiteNameFromUrl, interpolate } from '@/shared/utils/utils';
import { ReportButton } from '@/modules/resources/components/ReportButton';
import { RESOURCE_TYPE_COLORS } from '@/shared/constants/resource-type-colors';
import { TypeIcon } from '@/shared/constants/resource-type-icon';
import { localizeResource } from '@/shared/utils/localize-resource';

interface ResourceDetailClientProps {
  resource: Resource;
  repoPreview: GithubRepoPreviewData | null;
}

// Alias kept for readability within this file.
const typeColors = RESOURCE_TYPE_COLORS;

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 text-sm"><span className="text-[#777]">{icon}</span><span><strong>{label}:</strong> {value}</span></div>;
}

const smallIcon = (path: ReactNode) => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>{path}</svg>;

const globeIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
  </svg>
);

const apiIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
  </svg>
);

// Visit-site and use-API banners (issue #299). Both are gated on real data:
// the website banner needs the resource's own website_url or, failing that,
// its documentation_url (with a parseable site name), and the API banner needs
// publisher-provided API details - it stays invisible until a resource
// actually has that data. CMS resources have neither link, so they fall back
// to their CMS gallery page (source_url) so every catalog entry has a way out.
// Usable = a real http(s) link with a site name to show, so a malformed website_url can't shadow a good docs link.
const isWebUrl = (url?: string | null): url is string =>
  !!url && /^https?:\/\//i.test(url) && getSiteNameFromUrl(url) !== null;

function ResourceCtaBanners({ resource }: { resource: Resource }) {
  const { t } = useLanguage();

  // documentation_url is free text from the dashboard, so only real http(s) links become a href.
  const websiteUrl = [resource.website_url, resource.documentation_url].find(isWebUrl) ?? null;
  const siteName = websiteUrl ? getSiteNameFromUrl(websiteUrl) : null;
  const cmsUrl = !websiteUrl && resource.source === 'cms' ? resource.source_url : null;

  const apiHref = resource.api_docs || resource.api_endpoint;

  return (
    <>
      {websiteUrl && siteName && (
        <ResourceCtaBanner
          href={websiteUrl}
          icon={globeIcon}
          title={t.resource.detail.visitSiteTitle}
          description={interpolate(t.resource.detail.visitSiteDescription, { name: siteName })}
          buttonLabel={interpolate(t.resource.detail.visitSiteButton, { name: siteName })}
          ariaLabel={`${t.resource.detail.visitSiteTitle} - ${siteName}`}
        />
      )}
      {cmsUrl && (
        <ResourceCtaBanner
          href={cmsUrl}
          icon={globeIcon}
          title={t.resource.detail.viewOnCmsTitle}
          description={t.resource.detail.viewOnCmsDescription}
          buttonLabel={t.resource.detail.viewOnCmsButton}
          ariaLabel={t.resource.detail.viewOnCmsTitle}
        />
      )}
      {apiHref && (
        <ResourceCtaBanner
          href={apiHref}
          icon={apiIcon}
          title={t.resource.detail.useApiTitle}
          description={
            resource.api_endpoint
              ? interpolate(t.resource.detail.useApiDescription, { endpoint: resource.api_endpoint })
              : undefined
          }
          // Docs link wins when present; the endpoint itself is the fallback
          // href. The label follows the destination (CodeRabbit review on #312).
          buttonLabel={
            resource.api_docs ? t.resource.detail.useApiButton : t.resource.detail.useApiEndpointButton
          }
          ariaLabel={t.resource.detail.useApiTitle}
        />
      )}
    </>
  );
}

export function ResourceDetailClient({ resource, repoPreview }: ResourceDetailClientProps) {
  const { t, locale, direction } = useLanguage();
  // Reading direction of the resource's own content (issue #303): driven by
  // the explicit content_language field only - never inferred from the text.
  // Resources without the field (CMS/Payload today) keep the site direction.
  // Bilingual sources (CMS) carry both languages, so the language is that of
  // the text actually shown (localizeResource), still explicit and not sniffed.
  const localized = localizeResource(resource, locale);
  const contentDirection =
    localized.contentLanguage === 'ar' ? 'rtl' : localized.contentLanguage === 'en' ? 'ltr' : direction;

  // Title direction (PR #316 review): a resource's canonical name can be in a
  // different language than its description (e.g. ratq-native keeps English
  // names on Arabic-content resources), so the title reads from its own
  // explicit field, falling back to the content direction - then the site.
  const titleDirection =
    localized.titleLanguage === 'ar' ? 'rtl' : localized.titleLanguage === 'en' ? 'ltr' : contentDirection;

  const dataPreview = usePreview(resource);
  const IsFromPayloadResource = resource.source === 'payload';
  const heroWebsiteUrl = isWebUrl(resource.website_url) ? resource.website_url : null;
  const heroSiteName = heroWebsiteUrl ? getSiteNameFromUrl(heroWebsiteUrl) : null;
  // Only resources genuinely hosted on GitHub get the GitHub stats box -
  // gate on a real GitHub URL, not on a fallback like "#" or the docs URL
  // (issue #299).
  const githubRepo = parseGithubRepoUrl(resource.github_url);
  console.log('ResourceDetailClient: resource', resource);
  return (
    <div className="bg-white pb-10 pt-32 text-black sm:pt-36" dir={direction}>
      <main className="mx-auto max-w-[1050px] px-4 sm:px-6">
        {/* Photo carousel (issue #295): uses preview_images when present,
            falls back to the single image_url photo, renders nothing when
            there are no usable photos. */}
        <ResourcePhotoCarousel resource={resource} />

        <header className="text-start">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${typeColors[resource.type]}`}><TypeIcon type={resource.type}/>{t.catalog.types[resource.type]}</span>
            {(resource.itqan_badge) && <span className="inline-flex h-9 items-center rounded-full bg-[#171717] px-4 text-xs font-black text-white">{t.resource.itqanBadge}</span>}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-[1.4] sm:text-4xl" dir={titleDirection}>{localized.name}</h1>
          {/* Meta-info row follows the resource's content language (issue
              #303) instead of the old hardcoded dir="ltr". Pill chips show
              visitors, the version, and the website name from website_url
              (issue #294) - the website pill is hidden when no usable
              website_url exists. DOM order is visitors, version, website so
              the RTL visual matches the Figma from the right.
              WARNING: the visitors count is a hardcoded 0 - no tracking
              exists yet, so this is a placeholder, not real data. Call it out
              in the PR until real visitor tracking lands. */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#555]" dir={contentDirection}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f1f1] px-4 py-2">{smallIcon(<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></>)} {interpolate(t.resource.detail.visitors, { count: 0 })}</span>
            {(resource.version) && (
              <>
              <span aria-hidden="true" className="text-[#d4d4d4]">|</span>
              <span className="inline-flex items-center rounded-full bg-[#f1f1f1] px-4 py-2">v{resource.version}</span>
              </>
            )}
            {heroSiteName && (
              <>
              <span aria-hidden="true" className="text-[#d4d4d4]">|</span>
              <a href={resource.website_url ?? "#"}  className="inline-flex items-center rounded-full bg-[#f1f1f1] px-4 py-2">{heroSiteName}</a>
              </>
            )}
          </div>
          
        </header>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_270px]">
          <div className="min-w-0" dir={direction}>
            <section>
              <h2 className="text-xl font-black">{t.resource.detail.description}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[#808080]" dir={contentDirection}>{localized.description}</p>
            </section>
          </div>

          <aside className="space-y-4" dir={direction}>
            {resource.consumers && resource.consumers.length > 0 && <TrustedBySection consumers={resource.consumers}/>}
            <section className="rounded-xl border border-[#e6e6e6] bg-white p-5">
              <h2 className="text-sm font-black">{t.resource.detail.quickSummary}</h2>
              <ul className="mt-4 space-y-3 text-xs">
                <li className="flex items-center justify-between"><span>{t.resource.detail.status}</span><strong>{t.resource.detail.published}</strong></li>
                <li className="flex items-center justify-between"><span>{t.resource.detail.license}</span><strong>{resource.license}</strong></li>
                <li className="flex items-center justify-between"><span>{t.resource.detail.itqanCertified}</span><strong>{resource.itqan_badge ? t.resource.detail.yes : t.resource.detail.no}</strong></li>
              </ul>
            </section>

            {IsFromPayloadResource && (
              <>
                {/* Access requests button temporarily hidden */}

                <ReportButton
                  resourceId={resource.id}
                  resourceSlug={resource.slug}
                  resourceName={resource.name}
                />
              </>
            )}
          </aside>
        </div>
        <section className="mt-8 rounded-xl border border-[#e5e5e5] bg-white p-6">
          <h2 className="text-xl font-black">{t.resource.detail.technicalDetails}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {localized.publisherName && (
              <InfoItem
                icon={smallIcon(
                  <>
                    <path d="M3 21h18" />
                    <path d="M6 21V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
                    <path d="M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1" />
                  </>
                )}
                label={t.resource.detail.publisher}
                value={localized.publisherName}
              />
            )}
            <InfoItem icon={smallIcon(<><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></>)} label={t.resource.detail.type} value={t.catalog.types[resource.type]}/>
            <InfoItem icon={smallIcon(<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>)} label={t.resource.detail.publishDate} value={formatDate(resource.created_at, locale)}/>
          </div>
        </section>

        {githubRepo && (
          <section className="mt-6">
            <GithubStatsCard githubUrl={resource.github_url as string} stats={resource.github_stats}/>
            <GithubRepoPreview repoPreview={repoPreview} />
          </section>
        )}

            {IsFromPayloadResource && (
              <div className="mt-12">
                <ResourcePreview
                  loading={dataPreview.loading}
                  previewData={dataPreview.data}
                  resourceType={resource.type}
                />

                <RelatedResources
                  currentResourceId={resource.id}
                  currentResourceType={resource.type}
                />

                <CommentSection
                  resourceId={resource.id}
                  resourceSlug={resource.slug}
                />
              </div>

            )}

        {/* Visit-site / use-API banners render below the preview area (issue
            #299), after the payload-source block above. */}
        <ResourceCtaBanners resource={resource} />
    
        <section className="mt-24 overflow-hidden rounded-[24px] bg-[linear-gradient(112deg,#edf1f1_15%,#dbeaf6_100%)] px-7 sm:px-12">
          <div className="grid items-stretch md:min-h-[340px] gap-8 md:grid-cols-[330px_1fr]" dir="ltr">
            <div className="flex h-[220px] items-end justify-center self-stretch overflow-hidden sm:h-[270px] md:h-full"><img src="/images/rocket.png" alt="" className="h-full w-auto max-w-full object-contain object-bottom md:max-w-none"/></div>
            <div className="flex flex-col items-start justify-center py-10 text-start" dir={direction}>
              <h2 className="text-3xl font-black sm:text-5xl">{locale === 'ar' ? 'انشر موردك القرآني' : 'Publish your Quranic resource'}</h2>
              <p className="mt-5 text-base leading-8 text-[#818181] sm:text-lg">{locale === 'ar' ? 'شارك مكتبتك أو أداة التطوير أو مجموعة البيانات مع المجتمع.' : 'Share your library, development tool, or dataset with the community.'}</p>
              <Link href="/dashboard/resources" className="mt-7 inline-flex rounded-full bg-black px-10 py-4 text-base font-black text-white transition hover:bg-[#171717]">{locale === 'ar' ? 'انشره الآن' : 'Publish now'}</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
