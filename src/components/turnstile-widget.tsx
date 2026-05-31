"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export default function TurnstileWidget() {
  return (
    <div className="mt-2">
      <Turnstile
        siteKey={String(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "")}
        options={{
          responseField: true,
          responseFieldName: "captcha",
        }}
      />
    </div>
  );
}
