"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ChevronRightIcon, BellIcon, ChevronLeftIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { NotificationStats } from "@/components/notifications/notification-stats";
import { NotificationItem } from "@/components/notifications/notification-item";
import { SubscriptionForm } from "@/components/notifications/subscription";
import { useSearchParams } from "next/navigation";
import { APICaller } from "@/utils/apiCaller";
import { DateTime } from "luxon";

interface Notification {
  sender_name: string;
  sender_designation: string;
  time: string;
  subject: string;
  message: string;
  category: string;
}

function getLatestNotificationCount(notifications: Notification[]) {
  let count = 0;
  //count number of notications for which time is less than 1 hour ago
  for (let i = 0; i < notifications.length; i++) {
    const notificationTime = DateTime.fromISO(notifications[i].time).setZone(
      "Asia/Kolkata",
    );
    const currentTime = DateTime.local()
      .plus({ hours: 5, minutes: 30 })
      .setZone("Asia/Kolkata");
    const diff = currentTime.diff(notificationTime, "hours").hours;
    if (diff > 1) {
      count++;
    } else {
      break;
    }
  }
  return 0;
}

export default function Notifications() {
  return (
    <div className="hidden flex-col md:flex">
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationPage />
      </Suspense>
    </div>
  );
}

function NotificationPage() {
  const query = useSearchParams();
  const sg = query.get("subgroup") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubgroup, setSelectedSubgroup] = useState(sg);
  const [totalPages, setTotalPages] = useState(0);
  const [forStats, setForStats] = useState<Notification[]>([]);
  const [currentNotifications, setCurrentNotifications] = useState<
    Notification[]
  >([]);
  const notificationsPerPage = 5;

  const fetchNotifications = async (page: number) => {
    try {
      setIsLoading(true);
      const { data } = await APICaller({
        method: "GET",
        path: "/notifications/subgroup/" + selectedSubgroup,
      });
      setForStats(data);
      const indexOfLastNotification = page * notificationsPerPage;
      const indexOfFirstNotification =
        indexOfLastNotification - notificationsPerPage;
      console.log(data);
      setCurrentNotifications(
        data.slice(indexOfFirstNotification, indexOfLastNotification),
      );
      setTotalPages(Math.ceil(data.length / notificationsPerPage));
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center">
        <BellIcon className="w-8 h-8 mr-2" />
        Notifications {selectedSubgroup && "for " + selectedSubgroup}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Spinner speed="fast" size="md" />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {currentNotifications.map((notification, index) => (
                      <React.Fragment key={notification.time}>
                        <NotificationItem
                          notification={notification}
                          isLatest={currentPage === 1 && index === 0}
                        />
                        {index < currentNotifications.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </React.Fragment>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-6">
          <NotificationStats
            latest={forStats ? getLatestNotificationCount(forStats) : 0}
            total={forStats ? forStats.length : 0}
            categories={0}
          />
          <SubscriptionForm subgroup={selectedSubgroup} />
        </div>
      </div>
    </div>
  );
}
