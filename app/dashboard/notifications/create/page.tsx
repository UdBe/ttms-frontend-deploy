"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = [
  "holiday",
  "info",
  "class_cancelled",
  "class_rescheduled",
  "exam",
  "other",
];

const userGroups = [
  { value: "all", label: "All Users", allowed: ["Dean"] },
  { value: "class", label: "Developers" },
  { value: "designers", label: "Designers" },
  { value: "managers", label: "Project Managers" },
  { value: "marketing", label: "Marketing Team" },
];

export default function CreateNotificationPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [userGroup, setUserGroup] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSend = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated success (you would replace this with actual API call and error handling)
    if (Math.random() > 0.2) {
      // 80% success rate for demonstration
      setSubmitStatus("success");
      setSubject("");
      setContent("");
      setUserGroup("");
    } else {
      setSubmitStatus("error");
    }

    setIsSubmitting(false);
  };

  const cancelSend = () => {
    setShowConfirmModal(false);
  };

  const selectedGroupLabel =
    userGroups.find((group) => group.value === userGroup)?.label || "Unknown";

  return (
    <div className="max-w-2xl mx-auto p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h1 className="text-2xl font-semibold mb-6 text-primary">
        Create New Notification
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message"
            required
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userGroup">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select Notification Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="userGroup">User Group</Label>
          <Select value={userGroup} onValueChange={setUserGroup} required>
            <SelectTrigger id="userGroup">
              <SelectValue placeholder="Select User Group" />
            </SelectTrigger>
            <SelectContent>
              {userGroups.map((group) => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Notification"}
        </Button>
      </form>
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`mt-4 p-4 rounded-md ${
              submitStatus === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {submitStatus === "success" ? (
                <CheckCircle2 className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              <p>
                {submitStatus === "success"
                  ? "Notification sent successfully!"
                  : "Failed to send notification. Please try again."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this notification? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p>
                <strong>Subject:</strong> {subject}
              </p>
              <p>
                <strong>Content:</strong> {content}
              </p>
              <p>
                <strong>User Group:</strong> {selectedGroupLabel}
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={cancelSend}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmSend} className="bg-primary">
              <Mail className="w-4 h-4 mr-2" />
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// scopes
/**
    doaa - entire batch, any particular department, any particular group
*/
