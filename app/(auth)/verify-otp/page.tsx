import { Suspense } from "react";
import VerifyOtp from "../../../components/Auth/VerifyOtp";

export default function VerifyOtpPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
}
