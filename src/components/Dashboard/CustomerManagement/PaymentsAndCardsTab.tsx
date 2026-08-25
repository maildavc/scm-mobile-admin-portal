"use client";

import React from "react";
import { FiArrowUpRight, FiArrowDownLeft, FiFileText } from "react-icons/fi";
import { runTableExportAction } from "@/components/Dashboard/ActionButton";
import { useCustomerCards, useCustomerPayments } from "@/hooks/useCustomers";
import { formatDateTimeDdMmYyyy } from "@/utils/dateFormatter";

const redactCardNumber = (value?: string | null) => {
  if (!value) return "••••";
  const digits = value.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return last4 ? `•••• ${last4}` : "••••";
};

const queryError = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string; error?: string } }; message?: string })
    ?.response?.data?.message ||
  (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
  (error as { message?: string })?.message ||
  fallback;

const ActionCard = ({
  title,
  actionText,
  onClick,
}: {
  title: string;
  actionText: string;
  onClick?: () => void;
}) => (
  <div className="flex-1 bg-white border border-[#F4F4F5] rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
        <FiFileText size={20} className="text-[#2F3140]" />
      </div>
      <div>
        <p className="text-sm text-[#707781] mb-1">{title}</p>
        <button
          onClick={() => (onClick ? onClick() : runTableExportAction(title))}
          className="text-xs text-[#B2171E] font-medium bg-[#FDE4E5] px-2 py-0.5 rounded"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

interface PaymentsAndCardsTabProps {
  customerId?: string;
  mode?: "view" | "approval";
}

const PaymentsAndCardsTab: React.FC<PaymentsAndCardsTabProps> = ({
  customerId,
  mode = "view",
}) => {
  const {
    data: cards = [],
    isLoading: cardsLoading,
    isError: cardsError,
    error: cardsErr,
  } = useCustomerCards(customerId);
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    isError: paymentsError,
    error: paymentsErr,
  } = useCustomerPayments(customerId);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ActionCard title="Download Table as PDF" actionText="Download" />
        <ActionCard title="Export Table as CSV" actionText="Export" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 h-fit">
          <h3 className="text-base font-bold text-[#2F3140] mb-6">Saved Cards</h3>
          {cardsLoading ? (
            <p className="text-sm text-[#707781]">Loading cards...</p>
          ) : cardsError ? (
            <p className="text-sm text-[#B2171E]">{queryError(cardsErr, "Unable to load cards.")}</p>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#707781] text-sm">
              <p>No cards saved yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cards.map((card) => (
                <div
                  key={card.cardId || card.maskedCardNumber}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-[#707781]">{card.cardType || "Card"}</p>
                    <p className="text-sm font-bold text-[#2F3140]">
                      {redactCardNumber(card.maskedCardNumber)}
                    </p>
                    <p className="text-xs text-[#707781]">
                      Added: {formatDateTimeDdMmYyyy(card.addedAt)}
                    </p>
                  </div>
                  {mode === "approval" && card.status === "Deleted" ? (
                    <span className="px-4 py-1.5 bg-[#F4F4F5] text-[#2F3140] text-xs font-bold rounded-lg">
                      Deleted
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {mode === "view" && (
          <div className="bg-white rounded-lg border border-[#F4F4F5] p-6">
            <h3 className="text-base font-bold text-[#2F3140] mb-6">Payment History</h3>
            {paymentsLoading ? (
              <p className="text-sm text-[#707781]">Loading payments...</p>
            ) : paymentsError ? (
              <p className="text-sm text-[#B2171E]">
                {queryError(paymentsErr, "Unable to load payments.")}
              </p>
            ) : payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-[#707781] text-sm">
                <p>No payment history available.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {payments.map((transaction) => {
                  const isDebit = String(transaction.type || "").toLowerCase().includes("debit");
                  return (
                    <div
                      key={transaction.paymentId || `${transaction.date}-${transaction.amount}`}
                      className="flex items-start justify-between gap-4 pb-6 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F5] flex-shrink-0 ${
                            isDebit ? "text-[#B2171E]" : "text-[#00C070]"
                          }`}
                        >
                          {isDebit ? <FiArrowUpRight size={20} /> : <FiArrowDownLeft size={20} />}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-bold text-[#2F3140]">
                            {transaction.type || "Payment"}
                          </p>
                          <p className="text-xs text-[#707781]">{transaction.status || ""}</p>
                          <p className="text-xs text-[#707781]">
                            {formatDateTimeDdMmYyyy(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${
                          isDebit ? "text-[#B2171E]" : "text-[#00C070]"
                        }`}
                      >
                        {transaction.currency || "NGN"} {transaction.amount ?? "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsAndCardsTab;
