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
import { usePagePresenter } from "./page.presenter";

export default function Page() {
  const {
    price,
    setPrice,
    periodUnit,
    setPeriodUnit,
    periodValue,
    setPeriodValue,
    frequencyUnit,
    setFrequencyUnit,
    frequencyValue,
    setFrequencyValue,
    hoursPerDay,
    setHoursPerDay,
    users,
    setUsers,
    result,
    thinkingEmoji,
    calculatedEmoji,
    isDetailMode,
    setIsDetailMode,
    calculateCost,
    totalHours,
    costPerDay,
  } = usePagePresenter();

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
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center">
              <ShoppingBagIcon className="mr-2 text-orange-500" />
              商品の価格（円）
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="例: 100000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border-orange-300 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              <CalendarIcon className="mr-2 text-green-500" />
              使用期間
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={periodValue}
                onChange={(e) => setPeriodValue(e.target.value)}
                className="border-green-300 focus:ring-green-500"
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
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              <CalendarIcon className="mr-2 text-orange-500" />
              使用頻度
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={frequencyValue}
                onChange={(e) => setFrequencyValue(e.target.value)}
                className="border-orange-300 focus:ring-orange-500"
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
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="border-green-300 focus:ring-green-500"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="users" className="flex items-center">
              <UsersIcon className="mr-2 text-orange-500" />
              使用する人数
            </Label>
            <Input
              id="users"
              type="number"
              placeholder="例: 1"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              className="border-orange-300 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="detail-mode"
              checked={isDetailMode}
              onCheckedChange={setIsDetailMode}
            />
            <Label htmlFor="detail-mode">詳細モード</Label>
          </div>
          <Button
            onClick={calculateCost}
            className="w-full transform rounded-full bg-gradient-to-r from-orange-500 to-green-500 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-green-600"
          >
            計算したろか！
          </Button>
          <AnimatePresence>
            {result !== null && (
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
                  {result.toFixed(2)}円
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: result > 100 ? "#e11d48" : "#059669" }}
                >
                  {result > 100
                    ? "もったいない！もっと使わなアカン！"
                    : "ええ感じや！元取れてるで！"}
                </p>
                <div className="mt-4 text-xs text-gray-600">
                  <p>総使用時間: {totalHours}時間</p>
                  <p>1日あたりのコスト: {costPerDay}円</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
