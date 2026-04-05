import type { ApiClient } from './client'

// ── Shared server-side shape ─────────────────────────────────────────────────

export interface ProposalRequest {
  id: number
  name: string
  email: string
  phone_number: string
  company_name: string
  details: string
  createdAt: string
  updatedAt: string
}

// ── Request bodies ───────────────────────────────────────────────────────────

export interface CreateProposalRequestBody {
  email: string
  name: string
  phone_number: string
  company_name: string
  details: string
}

// ── Response envelopes ───────────────────────────────────────────────────────

export interface CreateProposalRequestResponse {
  id: string
  status: string
  created_at?: string
}

export interface GetProposalRequestsResponse {
  data: ProposalRequest[]
  message: string
}

export interface GetProposalRequestResponse {
  data: ProposalRequest
  message: string
}

// ── Chat shapes ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: number
  proposal_request_id: number
  role: 'user' | 'assistant'
  message: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessageResponse {
  data: ChatMessage
  message: string
}

export interface ChatHistoryResponse {
  data: ChatMessage[]
  message: string
}

// ── Relevant content shapes ───────────────────────────────────────────────────

export interface RelevantProduct {
  variation_id: number
  product_id: number
  created_at: number
  deactivated_at: string | null
  integration_metadata: unknown
  integration_id: string | null
  title: Record<string, string>
  description: Record<string, string>
}

export interface RelevantContentResponse {
  data: RelevantProduct[]
  message: string
}

// ── Proposal draft shapes ────────────────────────────────────────────────────

export interface ProposalDraftData {
  uuid: string
  series_uuid: string
  title_md: string
  description_md: string | null
  description_html: string | null
  status: string
  language: string
  currency: string
  background_image: { id: number; uuid: string } | null
  background_video: string | null
  blocks: import('../types/proposal').ProposalBlock[]
  company_id: number
  data: { _is_agreement: boolean }
  expires_at: number | null
  has_been_sent: boolean
  is_agreement: boolean
  is_test: boolean
  payments_enabled: boolean
  recipient_name: string | null
  recipient_email: string | null
  recipient_phone: string | null
  recipient_company_name: string | null
  recipient_is_set: boolean
  signatures: unknown[]
  attachments: unknown[]
  tax_options: { mode: string; tax_included: boolean }
  value_with_tax: number
  value_without_tax: number
  created_at: number
  updated_at: number
}

export interface ProposalDraftResponse {
  data?: ProposalDraftData
  // Some endpoints return the object directly (no envelope)
  uuid?: string
  blocks?: ProposalDraftData['blocks']
}

// ── Resource class ───────────────────────────────────────────────────────────

export class ProposalsApi {
  constructor(private readonly client: ApiClient) {}

  createProposalRequest(
    body: CreateProposalRequestBody,
  ): Promise<CreateProposalRequestResponse> {
    return this.client.post('/proposal-requests', body)
  }

  getProposalRequests(): Promise<GetProposalRequestsResponse> {
    return this.client.get('/proposal-requests')
  }

  getProposalRequest(id: number): Promise<GetProposalRequestResponse> {
    return this.client.get(`/proposal-requests/${id}`)
  }

  initializeChat(proposalRequestId: number): Promise<ChatMessageResponse> {
    return this.client.post(`/proposal-requests/${proposalRequestId}/chat/initialize`, {})
  }

  getChatHistory(proposalRequestId: number): Promise<ChatHistoryResponse> {
    return this.client.get(`/proposal-requests/${proposalRequestId}/chat`)
  }

  sendChatMessage(
    proposalRequestId: number,
    message: string,
  ): Promise<ChatMessageResponse> {
    return this.client.post(`/proposal-requests/${proposalRequestId}/chat`, { message })
  }

  getRelevantContent(proposalRequestId: number): Promise<RelevantContentResponse> {
    return this.client.get(`/proposal-requests/${proposalRequestId}/relevant-content`)
  }

  getProposalDraft(proposalRequestId: number): Promise<ProposalDraftData> {
    return this.client.get(`/proposal-requests/${proposalRequestId}/proposal-draft`)
  }
}
