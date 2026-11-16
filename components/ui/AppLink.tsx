import NextLink from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<typeof NextLink>;

/**
 * Internal link wrapper that disables Next.js segment prefetching.
 *
 * The site is exported statically (`output: "export"`). Next 16 emits
 * segment-prefetch URLs that do not exist as static files, which shows up
 * as 404s in the console on every hovered link. Navigation itself works
 * normally, so this wrapper keeps client-side routing but opts out of
 * prefetching by default.
 */
export function AppLink({ prefetch = false, ...props }: AppLinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
