"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  CalendarIcon,
  UsersIcon,
  AlertTriangleIcon,
  PlusIcon,
} from "lucide-react";
import { type FieldErrors, type FieldName, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

const formSchema = z.object({
  price: z
    .string()
    .min(1, "価格を入力してください 💰")
    .refine((val) => !isNaN(Number(val)), "価格は数値である必要があります 🔢"),
  periodValue: z
    .string()
    .min(1, "期間を入力してください ⏳")
    .refine((val) => !isNaN(Number(val)), "期間は数値である必要があります 🔢"),
  frequencyValue: z
    .string()
    .min(1, "頻度を入力してください 🔄")
    .refine((val) => !isNaN(Number(val)), "頻度は数値である必要があります 🔢"),
  users: z
    .string()
    .min(1, "人数を入力してください 👥")
    .refine((val) => !isNaN(Number(val)), "人数は数値である必要があります 🔢"),
});

type FormValues = z.infer<typeof formSchema>;

const CustomErrorMessage = ({
  errors,
  name,
}: {
  errors: FieldErrors<FormValues>;
  name: FieldName<FormValues>;
}) => (
  <ErrorMessage
    errors={errors}
    name={name}
    render={({ message }) => (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-1 flex items-center text-sm font-medium text-red-500"
      >
        <AlertTriangleIcon className="mr-1 h-4 w-4" />
        {message}
      </motion.p>
    )}
  />
);

const Page = () => {
  const [periodUnit, setPeriodUnit] = useState("months");
  const [frequencyUnit, setFrequencyUnit] = useState("week");
  const [thinkingEmoji, setThinkingEmoji] = useState("🤔");
  const [calculatedEmoji, setCalculatedEmoji] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [costPerDay, setCostPerDay] = useState<{
    costPerDayValue: string;
    costPercentage: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const price = watch("price");
  const periodValue = watch("periodValue");
  const frequencyValue = watch("frequencyValue");
  const users = watch("users", "1");

  const getPeriodInDays = useCallback(() => {
    const value = parseFloat(periodValue);
    return {
      years: value * 365,
      months: value * 30,
      weeks: value * 7,
      days: value,
    }[periodUnit];
  }, [periodValue, periodUnit]);

  const getTotalUses = useCallback(
    (totalDays: number) => {
      const value = parseFloat(frequencyValue);
      return {
        month: (totalDays / 30) * value,
        week: (totalDays / 7) * value,
        day: totalDays * value,
      }[frequencyUnit];
    },
    [frequencyValue, frequencyUnit],
  );

  const calculateCost = useCallback(() => {
    const totalDays = getPeriodInDays();
    const totalUses = getTotalUses(totalDays ?? 0);

    const costPerUse = parseInt(price) / ((totalUses ?? 0) * parseFloat(users));

    setResult(costPerUse);

    if (!isNaN(costPerUse)) {
      const costRatio = (costPerUse / parseFloat(price)) * 100;

      if (costRatio > 50) setCalculatedEmoji("😱");
      else if (costRatio > 25) setCalculatedEmoji("😰");
      else if (costRatio > 10) setCalculatedEmoji("🤨");
      else if (costRatio > 5) setCalculatedEmoji("🙂");
      else if (costRatio > 1) setCalculatedEmoji("😄");
      else setCalculatedEmoji("🤩");

      const costPercentage = costRatio.toFixed(2);
      const costPerDayValue = costPerUse.toFixed(2);
      setCostPerDay({
        costPerDayValue: costPerDayValue,
        costPercentage: costPercentage,
      });
    }
  }, [getPeriodInDays, getTotalUses, price, users]);

  const onSubmit = useCallback(() => {
    calculateCost();
  }, [calculateCost]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingEmoji((prev) => (prev === "🤔" ? "💭" : "🤔"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const increasePrice = useCallback(
    (amount: number) => {
      const currentPrice = parseInt(price) || 0;
      setValue("price", (currentPrice + amount).toString(), {
        shouldValidate: true,
      });
    },
    [price, setValue],
  );

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 shadow-lg backdrop-blur-sm">
        <CardHeader className="rounded-t-lg bg-gradient-to-r from-orange-500 to-green-500 text-white">
          <CardTitle className="flex items-center justify-center text-center text-3xl font-bold">
            元とらなアカン
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <motion.div
            className="text-center text-6xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {calculatedEmoji ?? thinkingEmoji}
          </motion.div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center">
                <ShoppingBagIcon className="mr-2 text-orange-500" />
                商品の価格（円）
              </Label>
              <Input
                id="price"
                type="text"
                placeholder="例: 100000"
                {...register("price")}
                className="border-orange-300 focus-visible:ring-orange-500"
              />
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => increasePrice(1000)}
                  className="flex-1 text-xs"
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  千円
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => increasePrice(10000)}
                  className="flex-1 text-xs"
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  1万円
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => increasePrice(100000)}
                  className="flex-1 text-xs"
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  10万円
                </Button>
              </div>
              <CustomErrorMessage errors={errors} name="price" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <CalendarIcon className="mr-2 text-green-500" />
                使用期間
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="例: 1"
                  {...register("periodValue")}
                  className="border-green-300 focus-visible:ring-green-500"
                />
                <Select value={periodUnit} onValueChange={setPeriodUnit}>
                  <SelectTrigger className="border-green-300 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">年</SelectItem>
                    <SelectItem value="months">ヶ月</SelectItem>
                    <SelectItem value="weeks">週間</SelectItem>
                    <SelectItem value="days">日</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CustomErrorMessage errors={errors} name="periodValue" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <CalendarIcon className="mr-2 text-orange-500" />
                使用頻度
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="例: 1"
                  {...register("frequencyValue")}
                  className="border-orange-300 focus-visible:ring-orange-500"
                />
                <Select value={frequencyUnit} onValueChange={setFrequencyUnit}>
                  <SelectTrigger className="border-orange-300 focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">回/日</SelectItem>
                    <SelectItem value="week">回/週</SelectItem>
                    <SelectItem value="month">回/月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CustomErrorMessage errors={errors} name="frequencyValue" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="users" className="flex items-center">
                <UsersIcon className="mr-2 text-orange-500" />
                使用する人数
              </Label>
              <Input
                id="users"
                type="text"
                placeholder="例: 1"
                {...register("users")}
                className="border-orange-300 focus-visible:ring-orange-500"
              />
              <CustomErrorMessage errors={errors} name="users" />
            </div>
            <Button
              type="submit"
              disabled={!isValid}
              className="w-full transform rounded-full bg-gradient-to-r from-orange-500 to-green-500 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-green-600 disabled:opacity-50"
            >
              計算したろか！
            </Button>
          </form>
          <AnimatePresence>
            {result !== null && !isNaN(result) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 rounded-lg bg-white/50 p-4 text-center shadow-inner backdrop-blur-sm"
              >
                <p className="text-lg font-semibold text-gray-800">
                  1日あたりの使用コスト
                </p>
                <p className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-4xl font-bold text-transparent">
                  {result?.toFixed(2)}円
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{
                    color:
                      costPerDay && parseFloat(costPerDay.costPercentage) > 25
                        ? "#e11d48"
                        : "#059669",
                  }}
                >
                  {costPerDay && parseFloat(costPerDay.costPercentage) > 25
                    ? "もったいない！もっと使わなアカン！ 😱"
                    : "ええ感じや！元取れてるで！ 😄"}
                </p>
                <div className="mt-4 text-xs text-gray-600">
                  <p>
                    価格に対するコスト割合: {costPerDay?.costPercentage}% 📊
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(Page);
