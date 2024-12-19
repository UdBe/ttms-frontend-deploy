import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const NotificationStats = ({
  latest,
  total,
  categories,
}: {
  latest: number;
  total: number;
  categories: number;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Notification Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-2xl font-bold">{latest}</p>
          <p className="text-sm text-muted-foreground">New</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{categories}</p>
          <p className="text-sm text-muted-foreground">Categories</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
