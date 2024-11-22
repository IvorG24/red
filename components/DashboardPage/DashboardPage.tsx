"use client";
import CardAmount from "../ui/cardAmount";

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Buttons Section */}
      <div className="w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
          <CardAmount
            title="Total Revenue"
            value="$15,231.89"
            description="+20.1% from last month"
            descriptionClassName="text-sm text-green-600"
          />

          <CardAmount
            title="Active Users"
            value="12,345"
            description="Updated 5 minutes ago"
            descriptionClassName="text-sm text-gray-500"
          />

          <CardAmount
            title="New Subscriptions"
            value="456"
            description="+15.6% from last week"
            descriptionClassName="text-sm text-green-600"
          />

          <CardAmount
            title="Monthly Expenses"
            value="$7,891.23"
            description="-10.2% from last month"
            descriptionClassName="text-sm text-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;