"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SubscriptionForm = ({ subgroup }: { subgroup: string }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitStatus(Math.random() > 0.2 ? "success" : "error");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stay Updated</CardTitle>
        <CardDescription>
          Subscribe to receive notifications via email{" "}
          {subgroup && `for ${subgroup}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </CardContent>
      {submitStatus && (
        <CardFooter>
          <p
            className={`text-sm ${submitStatus === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {submitStatus === "success"
              ? "Subscribed successfully!"
              : "Failed to subscribe. Please try again."}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};
