import { get, set } from "idb-keyval";

export interface LocalDoc {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const DOCS = "mdt-docs";
const SHARES = "mdt-shares";

function id() {
  return crypto.randomUUID();
}

export function titleFromMarkdown(content: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading.slice(0, 80);
  const line = content.split("\n").find((item) => item.trim());
  return (line ?? "Untitled").replace(/^#+\s*/, "").slice(0, 80) || "Untitled";
}

export async function listDocs(): Promise<LocalDoc[]> {
  const docs = (await get<LocalDoc[]>(DOCS)) ?? [];
  return docs.sort((a, b) => b.updatedAt - a.updatedAt);
}

async function writeDocs(docs: LocalDoc[]) {
  await set(DOCS, docs);
}

export async function getDoc(docId: string) {
  return (await listDocs()).find((doc) => doc.id === docId) ?? null;
}

export async function saveDoc(input: { id?: string; content: string; title?: string }) {
  const docs = await listDocs();
  const now = Date.now();
  if (input.id) {
    const index = docs.findIndex((doc) => doc.id === input.id);
    if (index >= 0) {
      docs[index] = {
        ...docs[index],
        content: input.content,
        title: input.title || titleFromMarkdown(input.content),
        updatedAt: now,
      };
      await writeDocs(docs);
      return docs[index];
    }
  }
  const doc: LocalDoc = {
    id: input.id || id(),
    title: input.title || titleFromMarkdown(input.content),
    content: input.content,
    updatedAt: now,
  };
  docs.unshift(doc);
  await writeDocs(docs);
  return doc;
}

export async function deleteDoc(docId: string) {
  await writeDocs((await listDocs()).filter((doc) => doc.id !== docId));
}

export async function createShare(content: string, title: string) {
  const shares = (await get<Record<string, { title: string; content: string; createdAt: number }>>(SHARES)) ?? {};
  const shareId = id();
  shares[shareId] = { title, content, createdAt: Date.now() };
  await set(SHARES, shares);
  return shareId;
}

export async function readShare(shareId: string) {
  const shares = (await get<Record<string, { title: string; content: string; createdAt: number }>>(SHARES)) ?? {};
  return shares[shareId] ?? null;
}
