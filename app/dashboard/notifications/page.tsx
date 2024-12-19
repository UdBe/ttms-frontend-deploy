"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { NotificationItem } from "@/components/notifications/notification-item";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { NotificationStats } from "@/components/notifications/notification-stats";

interface Notification {
  sender_name: string;
  sender_designation: string;
  time: string;
  subject: string;
  message: string;
  category: string;
}

export default function NotificationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentNotifications, setCurrentNotifications] = useState<
    Notification[]
  >([]);
  const notificationsPerPage = 3;
  const totalPages = Math.ceil(
    currentNotifications.length / notificationsPerPage,
  );

  const fetchNotifications = async (page: number) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const indexOfLastNotification = page * notificationsPerPage;
    const indexOfFirstNotification =
      indexOfLastNotification - notificationsPerPage;
    setCurrentNotifications(
      currentNotifications.slice(
        indexOfFirstNotification,
        indexOfLastNotification,
      ),
    );
    setIsLoading(false);
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
    <div className="max-w-2xl w-full mx-auto p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <React.Fragment key={notification.message}>
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
        <div className="space-y-6">{/* <NotificationStats /> */}</div>
      </div>
    </div>
  );
}
