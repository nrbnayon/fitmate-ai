export interface Policy {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export interface PolicyListResponse {
  success: boolean;
  status: number;
  message: string;
  data: Policy[];
}

export interface SinglePolicyResponse {
  success: boolean;
  status: number;
  message: string;
  data: Policy;
}

export interface PolicyMutationPayload {
  title: string;
  description: string;
}
