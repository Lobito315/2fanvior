import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <main className="shell flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Restore access</h1>
        <p className="mt-2 text-sm text-slate-400">We generate a reset response and notify the account owner.</p>
        <form action="/api/auth/forgot-password" method="post" className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Button className="w-full" type="submit">
            Send recovery instructions
          </Button>
        </form>
      </Card>
    </main>
  );
}
