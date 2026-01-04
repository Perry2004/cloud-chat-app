import { Unauthenticated } from "@/pages/errors/Unauthenticated";
import { UnauthenticatedError } from "@/utils/errors";
import { InternalError } from "@/pages/errors/InternalError";

export function DefaultErrorComponent({ error }: { error: any }) {
  const message = error?.message || (typeof error === "string" ? error : "");

  if (message === UnauthenticatedError.message) {
    return <Unauthenticated />;
  }
  return <InternalError error={error} />;
}
