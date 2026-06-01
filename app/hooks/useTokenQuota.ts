"use client";

import { useState, useEffect, useCallback } from "react";

const MAX_TOKENS = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface QuotaData {
  timestamps: number[]; // timestamps of each query within the window
}

function getStorageKey(email: string) {
  return `deep-research-quota:${email}`;
}

function getQuotaData(email: string): QuotaData {
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { timestamps: [] };
    const data: QuotaData = JSON.parse(raw);
    // Filter out expired timestamps
    const now = Date.now();
    data.timestamps = data.timestamps.filter((t) => now - t < WINDOW_MS);
    return data;
  } catch {
    return { timestamps: [] };
  }
}

function saveQuotaData(email: string, data: QuotaData) {
  localStorage.setItem(getStorageKey(email), JSON.stringify(data));
}

export function useTokenQuota(email: string | null | undefined) {
  const [tokensUsed, setTokensUsed] = useState(0);
  const [nextResetTime, setNextResetTime] = useState<number | null>(null);

  const refresh = useCallback(() => {
    if (!email) return;
    const data = getQuotaData(email);
    setTokensUsed(data.timestamps.length);
    // Save cleaned data back
    saveQuotaData(email, data);
    // Calculate when the oldest token expires
    if (data.timestamps.length >= MAX_TOKENS) {
      const oldest = Math.min(...data.timestamps);
      setNextResetTime(oldest + WINDOW_MS);
    } else {
      setNextResetTime(null);
    }
  }, [email]);

  useEffect(() => {
    refresh();
    // Refresh every minute to update countdown
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const consumeToken = useCallback((): boolean => {
    if (!email) return false;
    const data = getQuotaData(email);
    if (data.timestamps.length >= MAX_TOKENS) {
      refresh();
      return false;
    }
    data.timestamps.push(Date.now());
    saveQuotaData(email, data);
    refresh();
    return true;
  }, [email, refresh]);

  const tokensRemaining = MAX_TOKENS - tokensUsed;
  const isExhausted = tokensRemaining <= 0;

  return {
    tokensUsed,
    tokensRemaining,
    maxTokens: MAX_TOKENS,
    isExhausted,
    nextResetTime,
    consumeToken,
  };
}
