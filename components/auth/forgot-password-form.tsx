"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Icon } from "@/components/atoms/icon";

export default function ForgotPasswordForm() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading">Reset Password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <Icon icon={ArrowLeft} size="sm" className="mr-2" aria-hidden={true} />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
