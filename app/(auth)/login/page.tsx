import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="shell flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Secure login with JWT session cookies.</p>
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Card>
    </main>
  );
}
