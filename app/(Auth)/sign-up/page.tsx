"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already signed in? Leave the auth pages.
  useEffect(() => {
    if (!sessionPending && session?.user) router.replace("/");
  }, [sessionPending, session, router]);

  const passwordRules = {
    // Must match Better Auth's server default (`minPasswordLength: 8` in
    // `lib/auth.ts` config); a shorter password passes the form but is
    // rejected server-side.
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const doPasswordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError("Password does not meet all requirements.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp.email({
        name: fullName,
        email,
        password,
        image: profileImageUrl || undefined,
      });
      if (error) {
        setError(error.message ?? "Could not create account.");
        return;
      }
      // Better Auth signs the user in on successful sign-up.
      router.push("/");
      router.refresh();
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
        requestSignUp: true,
      });
      if (error) {
        setError(error.message ?? "Google sign up failed.");
        setIsSubmitting(false);
      }
      // On success the Better Auth client redirects to Google automatically.
    } catch {
      setError("Google sign up failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-76px)] w-full max-w-md items-start justify-center px-5 py-20">
      <Card className="w-full p-8 shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join us and start your journey
          </p>
        </div>

        {/* Google Sign Up - white with border, hover glow */}
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all disabled:opacity-60"
          onClick={handleGoogleSignUp}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or sign up with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image Preview */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={
                profileImageUrl ||
                "https://via.placeholder.com/96?text=Avatar"
              }
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-muted"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/96?text=Avatar";
              }}
            />
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="block text-sm font-medium mb-1">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

            {password.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs">
                <RequirementItem
                  met={passwordRules.minLength}
                  label="At least 8 characters"
                />
                <RequirementItem
                  met={passwordRules.hasUppercase}
                  label="At least 1 uppercase letter"
                />
                <RequirementItem
                  met={passwordRules.hasLowercase}
                  label="At least 1 lowercase letter"
                />
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p
                className={`mt-1 text-xs ${
                  doPasswordsMatch ? "text-green-600" : "text-destructive"
                }`}
              >
                {doPasswordsMatch
                  ? "Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Profile Image URL */}
          <div>
            <Label
              htmlFor="profileImageUrl"
              className="block text-sm font-medium mb-1"
            >
              Profile Image URL (Optional)
            </Label>
            <Input
              id="profileImageUrl"
              type="url"
              placeholder="https://example.com/avatar.png"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />
          </div>

          {/* Gradient Sign Up Button */}
          <Button
            type="submit"
            disabled={!isPasswordValid || !doPasswordsMatch || isSubmitting}
            className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Creating account…
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-destructive mt-3 text-center">{error}</p>
        )}

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="underline underline-offset-4 font-medium text-indigo-600 hover:text-indigo-800"
          >
            Sign In
          </Link>
        </p>
      </Card>
    </main>
  );
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${
        met ? "text-green-600" : "text-muted-foreground"
      }`}
    >
      {met ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <X className="h-3.5 w-3.5" />
      )}
      {label}
    </li>
  );
}