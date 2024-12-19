"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icon";
import { APICaller } from "@/utils/apiCaller";
import { createSession } from "@/lib/session";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "../ui/spinner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;

    try {
      // Call the login API
      const { data } = await APICaller({
        path: "/login",
        body: { email, password },
      });
      if (data.success) {
        await createSession(data);
        toast({
          title: "Welcome " + data.user.name + "!",
          description: "You have successfully logged in.",
        });
        router.push("/dashboard");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Incorrect email or password. Please try again.");
      setIsLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="email@thapar.edu"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error */}
          <Button disabled={isLoading}>
            {isLoading && <Spinner speed="fast" size="sm" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  );
}
