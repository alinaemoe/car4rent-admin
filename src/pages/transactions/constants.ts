import { PayoutStatus, TransactionType, DepositStatus, PaymentStatus } from "./types";

export type TranslateFn = (key: string, fallback?: string) => string;

export const payoutStatusColors: Record<PayoutStatus, "default" | "warning" | "success"> = {
  [PayoutStatus.NOT_APPLICABLE]: "default",
  [PayoutStatus.PENDING]: "warning",
  [PayoutStatus.PAID]: "success",
};

export const payoutStatusLabels = (t: TranslateFn): Record<PayoutStatus, string> => ({
  [PayoutStatus.NOT_APPLICABLE]: t("transactions.payoutStatus.notApplicable", "N/A"),
  [PayoutStatus.PENDING]: t("transactions.payoutStatus.pending", "Pending"),
  [PayoutStatus.PAID]: t("transactions.payoutStatus.paid", "Paid"),
});

export const typeLabels = (t: TranslateFn): Record<TransactionType, string> => ({
  [TransactionType.RENTAL_PAYMENT]: t("transactions.type.rentalPayment", "Rental Payment"),
  [TransactionType.PENALTY]: t("transactions.type.penalty", "Penalty"),
  [TransactionType.DAMAGE_COMPENSATION]: t("transactions.type.damageCompensation", "Damage Comp."),
});

export const depositStatusColors: Record<DepositStatus, "default" | "info" | "success"> = {
  [DepositStatus.NOT_APPLICABLE]: "default",
  [DepositStatus.HELD]: "info",
  [DepositStatus.RETURNED]: "success",
};

export const depositStatusLabels = (t: TranslateFn): Record<DepositStatus, string> => ({
  [DepositStatus.NOT_APPLICABLE]: t("transactions.depositStatus.notApplicable", "N/A"),
  [DepositStatus.HELD]: t("transactions.depositStatus.held", "Held"),
  [DepositStatus.RETURNED]: t("transactions.depositStatus.returned", "Returned"),
});

export const paymentStatusColors: Record<PaymentStatus, "warning" | "success" | "default"> = {
  [PaymentStatus.PENDING]: "warning",
  [PaymentStatus.PAID]: "success",
  [PaymentStatus.REFUNDED]: "default",
};

export const paymentStatusLabels = (t: TranslateFn): Record<PaymentStatus, string> => ({
  [PaymentStatus.PENDING]: t("transactions.paymentStatus.pending", "Pending"),
  [PaymentStatus.PAID]: t("transactions.paymentStatus.paid", "Paid"),
  [PaymentStatus.REFUNDED]: t("transactions.paymentStatus.refunded", "Refunded"),
});

export const PIE_COLORS = ["#90a4ae", "#ff9800", "#4caf50"];
