import { Suspense } from "react";
import ResetPassword from "../../../components/Auth/ResetPassword";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div>
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </div>
  );
}
