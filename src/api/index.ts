import { ApiClient } from './client'
import { ProposalsApi } from './proposals'

const apiClient = new ApiClient(import.meta.env.VITE_API_URL)

export const proposalsApi = new ProposalsApi(apiClient)

// Re-export types for convenience
export { ApiClient, ApiError } from './client'
export { ProposalsApi } from './proposals'
export type {
  ProposalRequest,
  CreateProposalRequestBody,
  CreateProposalRequestResponse,
  GetProposalRequestsResponse,
  GetProposalRequestResponse,
  ChatMessage,
  ChatMessageResponse,
  ChatHistoryResponse,
  RelevantProduct,
  RelevantContentResponse,
  ProposalDraftData,
  ProposalDraftResponse,
  ContentItem,
  GetContentResponse,
  CreateContentBody,
  CreateContentResponse,
  BulkUploadContentResponse,
  UpdateContentBody,
  UpdateContentResponse,
  DeleteContentResponse,
} from './proposals'
