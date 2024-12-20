import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "@/components/ui/dropZone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createTopUpRequest } from "@/services/TopUp/TopUp";
import { escapeFormData } from "@/utils/function";
import { zodResolver } from "@hookform/resolvers/zod";
import { alliance_member_table } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  teamMemberProfile: alliance_member_table;
};

const topUpFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+$/, "Amount must be a number"),
  topUpMode: z.string().min(1, "Top up mode is required"),
  accountName: z.string().min(1, "Field is required"),
  accountNumber: z.string().min(1, "Field is required"),
  file: z
    .instanceof(File)
    .refine((file) => !!file, { message: "File is required" })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024, // 5MB limit
      { message: "File must be a valid image and less than 5MB." }
    ),
});

export type TopUpFormValues = z.infer<typeof topUpFormSchema>;

const DashboardDepositModalDeposit = ({ teamMemberProfile }: Props) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TopUpFormValues>({
    resolver: zodResolver(topUpFormSchema),
    defaultValues: {
      amount: "",
      topUpMode: "GCASH",
      accountName: "Test User 1",
      accountNumber: "1234567890",
      file: undefined,
    },
  });

  const onSubmit = async (data: TopUpFormValues) => {
    try {
      const sanitizedData = escapeFormData(data);

      await createTopUpRequest({
        TopUpFormValues: sanitizedData,
        teamMemberId: teamMemberProfile.alliance_member_id,
      });

      toast({
        title: "Top Up Successfully",
        description: "Please wait for it to be approved.",
        variant: "success",
      });
      setOpen(false);
      reset();
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onTopUpModeChange = (value: string) => {
    if (value === "GCASH") {
      setValue("accountName", "Test User 1");
      setValue("accountNumber", "1234567890");
    } else if (value === "GOTYME") {
      setValue("accountName", "Test User 2");
      setValue("accountNumber", "987654321");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Top Up Now</DialogTitle>
          <DialogDescription>
            Add an amount to add a amount to your wallet
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount Field */}
          <div>
            <Label htmlFor="amount">Enter Amount</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="amount"
                  placeholder="Enter the top-up amount (e.g., 1000)"
                  {...field}
                  autoFocus
                />
              )}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Top-Up Mode */}
          <div>
            <Label htmlFor="topUpMode">Select Top Up Mode</Label>
            <Controller
              name="topUpMode"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onTopUpModeChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select top-up mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GCASH">GCASH</SelectItem>
                    <SelectItem value="GOTYME">GOTYME</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.topUpMode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.topUpMode.message}
              </p>
            )}
          </div>

          {/* Account Details */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="accountName">Account Name</Label>
              <Controller
                name="accountName"
                control={control}
                render={({ field }) => (
                  <Input
                    readOnly
                    id="accountName"
                    placeholder="Account Name"
                    {...field}
                  />
                )}
              />
              {errors.accountName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    readOnly
                    id="accountNumber"
                    placeholder="Account Number"
                    {...field}
                  />
                )}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Upload Proof of Payment"
                  onFileChange={(file) => field.onChange(file)}
                />
              )}
            />
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">
                {errors.file?.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : null} Submit
          </Button>
        </form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDepositModalDeposit;
