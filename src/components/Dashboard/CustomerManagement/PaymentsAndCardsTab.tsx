"use client";

import React from "react";
import Button from "../../Button";
import { FiArrowUpRight, FiArrowDownLeft, FiFileText } from "react-icons/fi";

interface SavedCard {
  id: string;
  type: string;
  last4: string;
  addedDate: string;
  status: "Active" | "Deleted";
}

interface PaymentTransaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  date: string;
  type: "credit" | "debit";
}

const SAVED_CARDS: SavedCard[] = [
  {
    id: "1",
    type: "Mastercard",
    last4: "0057**********5678",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Deleted",
  },
  {
    id: "2",
    type: "Visa Card",
    last4: "0057**********5678",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Active",
  },
  {
    id: "3",
    type: "Verve card",
    last4: "0057**********5678",
    addedDate: "June 12, 2026 12:32 PM",
    status: "Active",
  },
];

const PAYMENTS_HISTORY: PaymentTransaction[] = [
  {
    id: "1",
    title: "Mutual Fund Withdrawal Redemption",
    description: "To Bank Account",
    amount: "-₦1,000,000",
    date: "Yesterday, 4:15PM",
    type: "debit",
  },
  {
    id: "2",
    title: "Investment Top-up",
    description: "Mutual Fund",
    amount: "+₦15,000",
    date: "Yesterday, 4:15PM",
    type: "credit",
  },
  {
    id: "3",
    title: "Investment Top-up",
    description: "Ethical Trade",
    amount: "+₦15,000",
    date: "Yesterday, 4:15PM",
    type: "credit",
  },
  {
    id: "4",
    title: "Investment Top-up",
    description: "Mutual Fund",
    amount: "+₦15,000",
    date: "Yesterday, 4:15PM",
    type: "credit",
  },
  {
    id: "5",
    title: "Investment Top-up",
    description: "Mutual Fund",
    amount: "+₦15,000",
    date: "Yesterday, 4:15PM",
    type: "credit",
  },
];

const ActionCard = ({
  title,
  actionText,
  onClick,
}: {
  title: string;
  actionText: string;
  onClick: () => void;
}) => (
  <div className="flex-1 bg-white border border-[#F4F4F5] rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center">
        <FiFileText size={20} className="text-[#2F3140]" />
      </div>
      <div>
        <p className="text-sm text-[#707781] mb-1">{title}</p>
        <button
          onClick={onClick}
          className="text-xs text-[#B2171E] font-medium bg-[#FDE4E5] px-2 py-0.5 rounded"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

interface PaymentsAndCardsTabProps {
  mode?: "view" | "approval";
}

const PaymentsAndCardsTab: React.FC<PaymentsAndCardsTabProps> = ({
  mode = "view",
}) => {
  const handleDeleteCard = (cardId: string) => {
    console.log("Delete card:", cardId);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <ActionCard
          title="Download Table as PDF"
          actionText="Download"
          onClick={() => console.log("Download PDF")}
        />
        <ActionCard
          title="Export Table as CSV"
          actionText="Export"
          onClick={() => console.log("Export CSV")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Cards Section */}
        <div className="bg-white rounded-lg border border-[#F4F4F5] p-6 h-fit">
          <h3 className="text-base font-bold text-[#2F3140] mb-6">
            Saved Cards
          </h3>

          <div className="flex flex-col gap-4">
            {SAVED_CARDS.map((card) => (
              <div
                key={card.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-[#707781]">{card.type}</p>
                  <p className="text-sm font-bold text-[#2F3140]">
                    {card.last4}
                  </p>
                  <p className="text-xs text-[#707781]">{`Added: ${card.addedDate}`}</p>
                </div>

                <div className="flex-shrink-0">
                  {mode === "approval" && card.status === "Deleted" ? (
                    <span className="px-4 py-1.5 bg-[#F4F4F5] text-[#2F3140] text-xs font-bold rounded-lg block text-center min-w-[80px]">
                      Deleted
                    </span>
                  ) : mode === "view" ? (
                    <Button
                      text="Delete card"
                      variant="outline"
                      onClick={() => handleDeleteCard(card.id)}
                      className="!w-auto !px-6 !py-2 !bg-[#F4F4F5]"
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History Section - Only show in view mode */}
        {mode === "view" && (
          <div className="bg-white rounded-lg border border-[#F4F4F5] p-6">
            <h3 className="text-base font-bold text-[#2F3140] mb-6">
              Payment History
            </h3>

            <div className="flex flex-col gap-6">
              {PAYMENTS_HISTORY.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between gap-4 pb-6 border-b border-[#F4F4F5] last:border-b-0 last:pb-0"
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F5] flex-shrink-0 ${
                        transaction.type === "debit"
                          ? "text-[#B2171E]"
                          : "text-[#00C070]"
                      }`}
                    >
                      {transaction.type === "debit" ? (
                        <FiArrowUpRight size={20} />
                      ) : (
                        <FiArrowDownLeft size={20} />
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-[#2F3140]">
                        {transaction.title}
                      </p>
                      <p className="text-xs text-[#707781]">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-[#707781]">
                        {transaction.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-bold whitespace-nowrap ${
                      transaction.type === "debit"
                        ? "text-[#B2171E]"
                        : "text-[#00C070]"
                    }`}
                  >
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsAndCardsTab;
