export interface LoanStatus {
  collateral_token: string;
  collateral_amount: number;
  borrowed_token: string;
  borrowed_amount: number;
  apy: number;
}

export interface User {
  userAccountId: string;
  topicId: string;
  createdAt: string;
  profilePicture: string;
  loan_status: LoanStatus[];
  updatedAt: number;
}
