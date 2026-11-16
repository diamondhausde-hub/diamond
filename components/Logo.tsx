import Image from "next/image";
import { withBasePath } from "@/lib/paths";

type Props = {
  variant?: "navy" | "white";
  className?: string;
  priority?: boolean;
  width?: number;
};

/** The supplied DIAMOND logo. Never redrawn or restyled. */
export function Logo({ variant = "navy", className, priority, width = 200 }: Props) {
  const height = Math.round((width * 151.69) / 710.33);
  return (
    <Image
      src={withBasePath(variant === "white" ? "/brand/logo-white.svg" : "/brand/logo.svg")}
      alt="DIAMOND"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}
