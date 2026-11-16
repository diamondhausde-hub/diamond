export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes the payload; content comes from our own data only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
