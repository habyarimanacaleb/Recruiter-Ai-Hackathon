"use client";

import VerifyEmailContent from "@/components/common/VerifyEmailContent";
import {  Suspense } from "react";

// Wrap in Suspense because of useSearchParams
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
