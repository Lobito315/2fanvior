"use client";

import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface PayPalUnlockButtonProps {
  postId: string;
  amount: number;
  onSuccess: () => void;
}

export function PayPalUnlockButton({ postId, amount, onSuccess }: PayPalUnlockButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className="h-12 w-full bg-surface-container-highest animate-pulse rounded-full"></div>;
  }

  return (
    <div className="w-full max-w-[300px]">
      <PayPalButtons
        style={{ layout: "horizontal", height: 48, label: "pay", shape: "pill" }}
        createOrder={async () => {
          try {
            const response = await fetch("/api/payments?action=create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ postId }),
            });
            const data = await response.json() as { orderId: string };
            return data.orderId || ""; 
          } catch (err) {
            console.error("PayPal Order Creation Error:", err);
            return "";
          }
        }}
        onApprove={async (data) => {
          try {
            const response = await fetch("/api/payments?action=capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                orderId: data.orderID,
                postId: postId,
                amount: amount.toString()
              }),
            });
            
            const result = await response.json() as { success: boolean };
            if (result.success) {
              onSuccess();
            }
          } catch (err) {
            console.error("PayPal Capture Error:", err);
          }
        }}
      />
    </div>
  );
}
