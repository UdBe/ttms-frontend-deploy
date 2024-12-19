"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DateTime } from "luxon";

interface Notification {
  sender_name: string;
  sender_designation: string;
  time: string;
  subject: string;
  message: string;
  category: string;
}

function timeAgo(timestamp: string) {
  const t = DateTime.fromISO(timestamp).setZone("Asia/Kolkata");
  const ind = DateTime.local()
    .plus({ hours: 5, minutes: 30 })
    .setZone("Asia/Kolkata");
  console.log(t.toString(), ind.toString());
  return t.toRelative({ base: ind });
}

export const NotificationItem: React.FC<{
  notification: Notification;
  isLatest: boolean;
}> = ({ notification, isLatest }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = notification.sender_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10 flex justify-center align-middle bg-primary/10 text-primary">
          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{notification.sender_name}</p>
              <p className="text-xs text-muted-foreground">
                {notification.sender_designation}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isLatest && (
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              )}
              <span className="text-xs text-muted-foreground">
                {timeAgo(notification.time)}
              </span>
            </div>
          </div>
          <p className={`mt-2 text-sm ${isExpanded ? "" : "line-clamp-2"}`}>
            Subject: {notification.subject}
          </p>
          {isExpanded && <p className="mt-2 text-sm">{notification.message}</p>}
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary">{notification.category}</Badge>
            <button
              className="text-xs text-primary flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUpIcon className="w-3 h-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDownIcon className="w-3 h-3 mr-1" />
                  Show more
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
