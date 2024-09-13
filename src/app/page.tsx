"use client";

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
import { Switch } from "~/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { useCallback, useEffect, useState } from "react";

const formSchema = z.object({
  price: z
    .string()
    .min(1, "価格を入力してください")
    .refine((val) => !isNaN(Number(val)), "価格は数値である必要があります"),
  periodValue: z
    .string()
    .min(1, "期間を入力してください")
    .refine((val) => !isNaN(Number(val)), "期間は数値である必要があります"),
  frequencyValue: z
    .string()
    .min(1, "頻度を入力してください")
    .refine((val) => !isNaN(Number(val)), "頻度は数値である必要があります"),
  users: z
    .string()
    .min(1, "人数を入力してください")
    .refine((val) => !isNaN(Number(val)), "人数は数値である必要があります"),
  hoursPerDay: z
    .string()
    .min(1, "時間を入力してください")
    .refine((val) => !isNaN(Number(val)), "時間は数値である必要があります"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [periodUnit, setPeriodUnit] = useState("months");
  const [frequencyUnit, setFrequencyUnit] = useState("week");
  const [thinkingEmoji, setThinkingEmoji] = useState("🤔");
  const [calculatedEmoji, setCalculatedEmoji] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [totalHours, setTotalHours] = useState<string | null>(null);
  const [costPerDay, setCostPerDay] = useState<{
    costPerDayValue: string;
    costPercentage: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      hoursPerDay: "1",
    },
  });

  const price = watch("price");
  const periodValue = watch("periodValue");
  const frequencyValue = watch("frequencyValue");
  const users = watch("users", "1");
  const hoursPerDay = watch("hoursPerDay", "1");

  const getPeriodInDays = useCallback(() => {
    const value = parseFloat(periodValue);
    switch (periodUnit) {
      case "years":
        return value * 365;
      case "months":
        return value * 30;
      case "weeks":
        return value * 7;
      default:
        return value;
    }
  }, [periodValue, periodUnit]);

  const getTotalUses = useCallback(
    (totalDays: number) => {
      const value = parseFloat(frequencyValue);
      switch (frequencyUnit) {
        case "month":
          return (totalDays / 30) * value;
        case "week":
          return (totalDays / 7) * value;
        default:
          return totalDays * value;
      }
    },
    [frequencyValue, frequencyUnit],
  );

  const calculateCost = () => {
    const totalDays = getPeriodInDays();
    const totalUses = getTotalUses(totalDays);
    const totalHoursValue = (totalUses * parseFloat(hoursPerDay)).toFixed(1);

    const costPerHour =
      parseInt(price) / (parseFloat(totalHoursValue) * parseFloat(users));

    setResult(costPerHour);

    if (!isNaN(costPerHour)) {
      const costRatio = (costPerHour / parseFloat(price)) * 100;

      if (costRatio > 50) setCalculatedEmoji("😱");
      else if (costRatio > 25) setCalculatedEmoji("😰");
      else if (costRatio > 10) setCalculatedEmoji("🤨");
      else if (costRatio > 5) setCalculatedEmoji("🙂");
      else if (costRatio > 1) setCalculatedEmoji("😄");
      else setCalculatedEmoji("🤩");

      const costPercentage = costRatio.toFixed(2);
      setTotalHours(totalHoursValue);
      const costPerDayValue = (
        costPerHour *
        parseFloat(hoursPerDay) *
        (parseFloat(frequencyValue) /
          (frequencyUnit === "month" ? 30 : frequencyUnit === "week" ? 7 : 1))
      ).toFixed(2);
      setCostPerDay({
        costPerDayValue: costPerDayValue,
        costPercentage: costPercentage,
      });
    }
  };

  const onSubmit = () => {
    calculateCost();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingEmoji((prev) => (prev === "🤔" ? "💭" : "🤔"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-100 to-green-100 p-4">
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
              <ErrorMessage errors={errors} name="price" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <CalendarIcon className="mr-2 text-green-500" />
                使用期間
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
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
              <ErrorMessage errors={errors} name="periodValue" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <CalendarIcon className="mr-2 text-orange-500" />
                使用頻度
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
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
              <ErrorMessage errors={errors} name="frequencyValue" />
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
              <ErrorMessage errors={errors} name="users" />
            </div>
            {isDetailMode && (
              <div className="space-y-2">
                <Label htmlFor="hoursPerDay" className="flex items-center">
                  <ClockIcon className="mr-2 text-green-500" />
                  1回あたりの使用時間（時間）
                </Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  defaultValue="1"
                  {...register("hoursPerDay")}
                  className="border-green-300 focus-visible:ring-green-500"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="detail-mode"
                checked={isDetailMode}
                onCheckedChange={setIsDetailMode}
              />
              <Label htmlFor="detail-mode">詳細モード</Label>
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
                  1時間あたりの使用コスト
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
                    ? "もったいない！もっと使わなアカン！"
                    : "ええ感じや！元取れてるで！"}
                </p>
                <div className="mt-4 text-xs text-gray-600">
                  <p>総使用時間: {totalHours}時間</p>
                  <p>1日あたりのコスト: {costPerDay?.costPerDayValue}円</p>
                  <p>価格に対するコスト割合: {costPerDay?.costPercentage}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
