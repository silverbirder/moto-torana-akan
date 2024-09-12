import { useState, useEffect, useCallback, useMemo } from "react";

export const usePagePresenter = () => {
  const [price, setPrice] = useState("");
  const [periodUnit, setPeriodUnit] = useState("months");
  const [periodValue, setPeriodValue] = useState("1");
  const [frequencyUnit, setFrequencyUnit] = useState("week");
  const [frequencyValue, setFrequencyValue] = useState("1");
  const [hoursPerDay, setHoursPerDay] = useState("1");
  const [users, setUsers] = useState("1");
  const [result, setResult] = useState<number | null>(null);
  const [thinkingEmoji, setThinkingEmoji] = useState("🤔");
  const [calculatedEmoji, setCalculatedEmoji] = useState<string | null>(null);
  const [isDetailMode, setIsDetailMode] = useState(false);

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

  const updateEmoji = useCallback((cost: number) => {
    if (cost > 1000) setCalculatedEmoji("😱");
    else if (cost > 500) setCalculatedEmoji("😰");
    else if (cost > 100) setCalculatedEmoji("🤨");
    else if (cost > 50) setCalculatedEmoji("🙂");
    else if (cost > 10) setCalculatedEmoji("😄");
    else setCalculatedEmoji("🤩");
  }, []);

  const calculateCost = useCallback(() => {
    const totalDays = getPeriodInDays();
    const totalUses = getTotalUses(totalDays);
    const totalHours = totalUses * parseFloat(hoursPerDay);
    const costPerHour = parseInt(price) / totalHours;
    setResult(costPerHour);
    updateEmoji(costPerHour);
  }, [getPeriodInDays, getTotalUses, hoursPerDay, price, updateEmoji]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingEmoji((prev) => (prev === "🤔" ? "💭" : "🤔"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalHours = useMemo(
    () =>
      (getTotalUses(getPeriodInDays()) * parseFloat(hoursPerDay)).toFixed(1),
    [getTotalUses, getPeriodInDays, hoursPerDay],
  );

  const costPerDay = useMemo(() => {
    if (result === null) return null;
    return (
      result *
      parseFloat(hoursPerDay) *
      (parseFloat(frequencyValue) /
        (frequencyUnit === "month" ? 30 : frequencyUnit === "week" ? 7 : 1))
    ).toFixed(2);
  }, [result, hoursPerDay, frequencyValue, frequencyUnit]);

  return {
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
  } as const;
};
