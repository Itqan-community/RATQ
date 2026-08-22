'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { listDeveloperResources } from '@/modules/developer/application/use-cases/list-developer-resources';
import { createResource } from '@/modules/developer/application/use-cases/create-developer-resource';
import { updateResource } from '@/modules/developer/application/use-cases/update-developer-resource';
import { deleteResource } from '@/modules/developer/application/use-cases/delete-developer-resource';
import { Sidebar } from '@/shared/ui/layout/Sidebar';
import { ResourceForm } from '@/modules/developer/components/ResourceForm';
import { ResourceBadge } from '@/shared/ui/Badge';
import { useLanguage } from '@/shared/ui/i18n';
import type { Resource, ResourceType } from '@/types/resource';

export default function DashboardResourcesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const copy = t.dashboard.resources;
  const [isClient, setIsClient] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [creating, setCreating] = useState(false);
  useEffect(() => { setIsClient(true); if (!user) router.push('/login'); }, [user, router]);
  useEffect(() => { if (user) listDeveloperResources(user.id).then(setResources).catch(() => setLoadError(true)); }, [user]);
  const handleCreate = async (data: { name: string; type: ResourceType; short_description: string; image?: number | null; description: string; license: string; github_url: string; documentation_url: string; }) => {
    setCreating(true);
    setCreateError(null);
    try {
      const created = await createResource({ ...data, status: 'published' });
      setResources((prev) => [created, ...prev]);
      setShowForm(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to publish resource');
    } finally {
      setCreating(false);
    }
  };
  const handleEdit = async (data: { name: string; type: ResourceType; short_description: string; image?: number | null; description: string; license: string; github_url: string; documentation_url: string; }) => {
    if (!editingResource) return;
    setCreating(true);
    setCreateError(null);
    try {
      const updated = await updateResource(editingResource.id, data);
      setResources((prev) => prev.map((resource) => resource.id === editingResource.id ? updated : resource));
      setEditingResource(null);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setCreating(false);
    }
  };
  const handleDelete = async (id: number) => {
    const previous = resources;
    setResources((prev) => prev.filter((resource) => resource.id !== id));
    try {
      await deleteResource(id);
    } catch {
      setResources(previous);
    }
  };
  if (!isClient || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-white"><div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" /></div>;
  const isFormOpen = showForm || Boolean(editingResource);
  return (
    <div className="min-h-screen bg-white text-black lg:flex" dir={direction}>
      <Sidebar />
      <div className="pt-32 lg:flex-1">
        <main className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="rounded-2xl bg-[linear-gradient(122.15deg,#EAF4ED_30.7%,#CFE7D8_86.27%)] p-6 text-center sm:p-8"><span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.badge}</span><h1 className="mt-5 text-3xl font-black leading-tight text-black sm:text-4xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">{copy.subtitle}</p></div><aside className="rounded-lg bg-[#171717] p-6 text-white"><p className="text-sm font-black text-[#e8ef3d]">{copy.quickAction}</p><button type="button" onClick={() => { setEditingResource(null); setShowForm((value) => !value); }} className="mt-5 h-11 w-full rounded-full bg-white px-5 text-sm font-black text-black transition hover:bg-[#e8ef3d]">{showForm ? copy.closeForm : copy.addResource}</button></aside></section>
        {isFormOpen && <section className="mt-7 rounded-lg border border-[#ededed] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-black text-black">{editingResource ? `Edit: ${editingResource.name}` : 'Add resource'}</h2><button type="button" onClick={() => { setShowForm(false); setEditingResource(null); setCreateError(null); }} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] text-[#6f7780] transition hover:bg-[#ededed]">x</button></div>{createError && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{createError}</div>}<ResourceForm initial={editingResource ? { name: editingResource.name, type: editingResource.type, short_description: editingResource.short_description, description: editingResource.description, license: editingResource.license, github_url: editingResource.github_url || '', documentation_url: editingResource.documentation_url || '', image_url: editingResource.image_url || null } : undefined} onSubmit={editingResource ? handleEdit : handleCreate} submitLabel={editingResource ? t.dashboard.common.saveChanges : creating ? 'Publishing...' : copy.saveResource} /></section>}
        <section className="mt-7"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-black text-black">{copy.publishedResources.replace('{{count}}', String(resources.length))}</h2><p className="mt-2 text-sm leading-6 text-[#6f7780]">{copy.description}</p></div><Link href="/resources" className="text-sm font-black text-[#171717] transition hover:text-black">{copy.viewCatalog}</Link></div>{loadError ? <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center"><p className="text-sm font-bold text-red-700">Couldn&apos;t load your resources. Try refreshing the page.</p></div> : resources.length === 0 ? <div className="rounded-lg border border-[#ededed] bg-[#fafafa] p-8 text-center"><p className="mb-5 text-sm font-bold text-[#8b949e]">{copy.empty}</p><button type="button" onClick={() => setShowForm(true)} className="h-10 rounded-full bg-black px-5 text-sm font-black text-white">{copy.addFirst}</button></div> : <div className="grid gap-4">{resources.map((resource) =><article key={resource.id} className="rounded-lg border border-[#ededed] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="min-w-0 flex-1"><div className="mb-3 flex flex-wrap items-center gap-2"><ResourceBadge type={resource.type} />{resource.itqan_badge && <span className="rounded-full bg-[#fff7e6] px-3 py-1 text-xs font-black text-[#9a5a00]">Itqan</span>}<span className={`rounded-full px-3 py-1 text-xs font-black ${resource.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{resource.status === 'published' ? t.dashboard.common.published : t.dashboard.common.draft}</span></div><h3 className="truncate text-lg font-black text-black"><Link href={`/resources/${resource.slug}`} className="transition hover:text-[#171717]">{resource.name}</Link></h3><p className="mt-2 text-sm font-bold text-[#8b949e]">{t.catalog.types[resource.type]} - {resource.license}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => { setEditingResource(resource); setShowForm(false); }} className="h-9 rounded-full border border-[#171717] px-4 text-xs font-black text-[#171717] transition hover:bg-[#171717] hover:text-white">{t.dashboard.common.edit}</button><button type="button" onClick={() => handleDelete(resource.id)} className="h-9 rounded-full border border-red-200 px-4 text-xs font-black text-red-700 transition hover:bg-red-50">{t.dashboard.common.delete}</button></div></div></article>)}</div>}</section>
        </main>
      </div>
    </div>
  );
}