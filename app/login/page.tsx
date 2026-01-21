// app/login/page.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthSchema } from "@/schemas/auth.schema";
import z from "zod";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { data: session } = useSession();

  if (session?.user) {
    router.replace("/");
  }

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      csrfToken: csrfToken,
    },
    validators: {
      onSubmit: AuthSchema,
      onBlur: AuthSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError("");

      try {
        const res = await signIn("credentials", {
          redirect: false,
          ...value,
        });
        if (res?.error) {
          setError(`${res.error} ${!res.ok && "Login failed"}`);
        } else {
          router.replace("/");
        }
      } catch {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Masukkan email dan password untuk masuk ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form.Field
                name="csrfToken"
                children={(field) => (
                  <input
                    type="hidden"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="nama@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                      <FieldDescription>
                        Password harus minimal 8 karakter
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Login"}
          </Button>
          <div className="text-sm text-center text-gray-600">
            Demo: user@example.com / password123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
