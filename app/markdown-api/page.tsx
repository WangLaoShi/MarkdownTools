import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Markdown document API",
  description: "How MarkdownTools documents are addressed over HTTP, and what this browser build actually stores.",
};

const rows = [
  ["GET", "/api/v1/documents", "List documents, newest first.", "documents:read"],
  ["POST", "/api/v1/documents", "Create a document from JSON or raw Markdown.", "documents:write"],
  ["GET", "/api/v1/documents/:id", "Read one document. Ask for text/markdown to get the raw file.", "documents:read"],
  ["PUT", "/api/v1/documents/:id", "Replace a document. Send If-Match so two writers do not overwrite each other.", "documents:write"],
  ["DELETE", "/api/v1/documents/:id", "Delete a document.", "documents:write"],
];

export default function MarkdownApiPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Markdown document API</h1>
      <p className="mt-4 text-muted">
        The hosted product keeps Markdown in an account and reads it back over HTTP: raw <code>.md</code> URLs, content negotiation, and conditional writes. This build stores documents in the browser instead, under <Link href="/workspace" className="underline">My documents</Link>. The shapes below are the contract.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Authentication</h2>
      <p className="mt-2 text-muted">Send a token as a bearer credential. Tokens begin with <code>mdt_</code>, carry the scopes you chose, and can be revoked from settings.</p>
      <pre className="mt-4 overflow-auto rounded-2xl border border-border p-4 text-sm">{`curl https://www.markdowntools.io/api/v1/documents \\
  -H "Authorization: Bearer $MDT_TOKEN"`}</pre>
      <p className="mt-3 text-sm text-muted">Responses include RateLimit-Limit, RateLimit-Remaining, and RateLimit-Reset. A 429 carries Retry-After.</p>
      <h2 className="mt-8 text-xl font-semibold">Endpoints</h2>
      <div className="mt-4 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Method", "Path", "Does", "Scope"].map((heading) => (
                <th key={heading} className="border border-border px-3 py-2 text-left">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[1] + row[0]}>
                {row.map((cell) => (
                  <td key={cell} className="border border-border px-3 py-2 align-top">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-8 text-xl font-semibold">Create a document</h2>
      <pre className="mt-4 overflow-auto rounded-2xl border border-border p-4 text-sm">{`curl https://www.markdowntools.io/api/v1/documents \\
  -H "Authorization: Bearer $MDT_TOKEN" \\
  -H "Content-Type: text/markdown" \\
  --data-binary @README.md`}</pre>
      <p className="mt-6 text-sm text-muted">
        In this build, create and edit documents from the <Link href="/editor" className="underline">editor</Link>. Export everything from <Link href="/workspace/settings" className="underline">settings</Link>.
      </p>
    </article>
  );
}
