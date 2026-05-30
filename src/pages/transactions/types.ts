export enum PayoutStatus {
  NOT_APPLICABLE = "NOT_APPLICABLE",
  PENDING = "PENDING",
  PAID = "PAID",
}

export enum TransactionType {
  RENTAL_PAYMENT = "RENTAL_PAYMENT",
  PENALTY = "PENALTY",
  DAMAGE_COMPENSATION = "DAMAGE_COMPENSATION",
}

export enum DepositStatus {
  NOT_APPLICABLE = "NOT_APPLICABLE",
  HELD = "HELD",
  RETURNED = "RETURNED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export interface TransactionRow {
  id: number;
  rental: { id: number } | null;
  car: { id: number; brand: string; model: string; license_plate: string; images?: { image_url: string }[] } | null;
  lessor: { id: string; first_name: string; last_name: string; avatar_url?: string } | null;
  total_amount: string;
  system_fee: string;
  lessor_income: string;
  payout_status: PayoutStatus;
  type: TransactionType;
  created_at: string;
  base_rental_amount: string;
  penalty_amount: string;
  deposit_amount: string;
  deposit_status: DepositStatus;
  payment_status: PaymentStatus;
  customer_total: string;
}

export interface StatsData {
  totalRevenue: number;
  totalSystemFees: number;
  totalLessorIncome: number;
  pendingPayouts: number;
  totalPenalties: number;
  totalDeposits: number;
  platformNetIncome: number;
  transactionCount: number;
  monthlyStats: { month: string; revenue: number; fees: number; payouts: number; count: number; penalties: number }[];
  payoutStatusCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  paymentStatusCounts: Record<string, number>;
  depositStatusCounts: Record<string, number>;
}
