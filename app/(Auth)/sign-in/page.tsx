"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getSafeRedirectPath, signIn, useSession } from "@/lib/auth-client";
import { clearCachedApiToken } from "@/lib/api";
import { getErrorMessage, notify } from "@/lib/notifications"
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectPath =
    typeof window === "undefined"
      ? null
      : getSafeRedirectPath(
          new URLSearchParams(window.location.search).get("callbackUrl"),
        )

  // Already signed in? Leave the auth pages.
  useEffect(() => {
    if (!sessionPending && session?.user) {
      router.replace(redirectPath ?? "/auth/callback")
    }
  }, [redirectPath, sessionPending, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await signIn.email({ email, password });
      if (error) {
        notify("error", "Could not sign in", error.message ?? "Invalid email or password.");
        return;
      }
      notify("success", "Signed in successfully")
      clearCachedApiToken();
      router.replace(redirectPath ?? "/auth/callback");
      router.refresh();
    } catch (cause) {
      notify("error", "Sign in failed", getErrorMessage(cause, "Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: redirectPath ?? "/auth/callback",
      });
      if (error) {
        notify("error", "Google sign in failed", error.message ?? "Please try again.");
        setIsSubmitting(false);
      }
      // On success the Better Auth client redirects to Google automatically.
    } catch (cause) {
      notify("error", "Google sign in failed", getErrorMessage(cause, "Please try again."));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-76px)] w-full max-w-md items-start justify-center px-5 py-20">
      <Card className="w-full p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all disabled:opacity-60"
          onClick={handleGoogleSignIn}
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white font-semibold shadow-lg shadow-red-500/30 hover:from-red-600 hover:via-red-700 hover:to-rose-700 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-[#d62828] underline underline-offset-4 hover:text-[#a4161a]"
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </main>
  );
}