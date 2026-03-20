import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <main className="shell flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-lg">
        <h1 className="text-3xl font-bold">Join Fanvior</h1>
        <form action="/api/auth/signup" method="post" className="mt-6 grid gap-4">
          <Input name="username" placeholder="Username" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <select
            name="role"
            defaultValue="SUBSCRIBER"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
          >
            <option value="SUBSCRIBER">Subscriber</option>
            <option value="CREATOR">Creator</option>
          </select>
          <Button type="submit">Create account</Button>
        </form>
      </Card>
    </main>
  );
}
