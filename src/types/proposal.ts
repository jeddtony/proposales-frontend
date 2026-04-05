export interface PackageSplit {
  vat: number
  type: string
  fixed: boolean
  value_with_tax: number
  enable_discount: boolean
  value_without_tax: number
  value_saved_with_tax: boolean
}

export interface VideoBlock {
  type: 'video-block'
  uuid: string
  title: string
  language: string
  video_url: string
  content_id: number
  updated_at: string
  _title_was_overridden: boolean
  _out_of_sync_with_content_library: boolean
}

export interface ProductBlock {
  type: 'product-block'
  uuid: string
  title: string
  language: string
  currency: string
  content_id: number
  updated_at: string
  description?: string
  unit?: string
  image_uuids: string[]
  package_split: PackageSplit[]
  inventory_connected: boolean
  unit_value_with_discount_with_tax: number
  unit_value_with_discount_without_tax: number
  unit_value_without_discount_with_tax: number
  unit_value_without_discount_without_tax: number
  _title_was_overridden: boolean
  _out_of_sync_with_content_library: boolean
}

export type ProposalBlock = VideoBlock | ProductBlock

export interface ProposalData {
  uuid: string
  title: string
  title_md: string
  description_md: string | null
  description_html: string | null
  status: string
  language: string
  currency: string
  background_image: { id: number; uuid: string } | null
  background_video: string | null
  blocks: ProposalBlock[]
  // Company
  company_name: string
  company_email: string
  company_phone: string
  company_logo_uuid: string | null
  company_website: string
  company_address: string
  // Contact (sales rep / creator)
  contact_name: string
  contact_email: string
  contact_phone: string
  contact_title: string
  contact_avatar_uuid: string | null
  creator_name: string
  creator_email: string
  // Recipient
  recipient_name: string | null
  recipient_email: string | null
  recipient_company_name: string | null
  recipient_phone: string | null
  recipient_is_set: boolean
  // Financials
  value_with_tax: number
  value_without_tax: number
  // Dates (Unix ms)
  created_at: number
  updated_at: number
  expires_at: number | null
  status_changed_at: number
  // Options
  tax_options: { mode: string; tax_included: boolean }
  is_agreement: boolean
  has_been_sent: boolean
  is_test: boolean
  payments_enabled: boolean
}
