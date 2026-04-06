import { useState, useRef, useCallback } from 'react'
import * as XLSX from 'xlsx'
import {
  X,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CloudUpload,
} from 'lucide-react'
import { proposalsApi, ApiError } from '../../api'
import type { BulkUploadContentResponse } from '../../api'
import { cn } from '../../lib/utils'

// ── Template download ─────────────────────────────────────────────────────────

function downloadTemplate() {
  const rows = [
    { title: 'Ballroom Scenery',  language: 'en', description: 'Elegant ballroom for 500 guests',   image_url: 'https://16r3itju75.ucarecd.net/b88e7077-bc0f-4b12-b665-43e7691bab39/' },
    { title: 'Rooftop Terrace', language: 'en', description: 'Open-air terrace with city views',  image_url: 'https://16r3itju75.ucarecd.net/ac3aa9a0-1521-4be1-b8a0-54c49ce576f7/rooftopterrace.jpg' },
    { title: 'Conference Hall', language: 'sv', description: 'Konferenslokal för 200 personer',   image_url: 'https://16r3itju75.ucarecd.net/80ba2690-114b-4d5a-811e-01b579cc3c66/conferencehall.jpg' },
  ]

  const ws = XLSX.utils.json_to_sheet(rows, { header: ['title', 'language', 'description', 'image_url'] })

  // Column widths
  ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 38 }, { wch: 42 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Content')
  XLSX.writeFile(wb, 'content-template.xlsx')
}

// ── Types ─────────────────────────────────────────────────────────────────────

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

interface BulkUploadModalProps {
  onClose: () => void
  onUploaded: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BulkUploadModal({ onClose, onUploaded }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [state, setState] = useState<UploadState>('idle')
  const [result, setResult] = useState<BulkUploadContentResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptFile = useCallback((f: File) => {
    const ok = f.name.endsWith('.xlsx') || f.name.endsWith('.xls') ||
      f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      f.type === 'application/vnd.ms-excel'
    if (!ok) {
      setErrorMsg('Only .xlsx or .xls files are accepted.')
      return
    }
    setErrorMsg(null)
    setFile(f)
    setState('idle')
    setResult(null)
  }, [])

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) acceptFile(f)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) acceptFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setState('uploading')
    setErrorMsg(null)
    try {
      const res = await proposalsApi.bulkUploadContent(file)
      setResult(res)
      setState('success')
      onUploaded()
    } catch (err) {
      setState('error')
      setErrorMsg(
        err instanceof ApiError
          ? `Upload failed (${err.status}): ${err.message}`
          : 'Upload failed. Please try again.',
      )
    }
  }

  function reset() {
    setFile(null)
    setState('idle')
    setResult(null)
    setErrorMsg(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-[#0a1b39] font-headline">Bulk Upload Content</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Step 1: Download template */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#0a1b39]">Step 1 — Download template</p>
              <p className="text-xs text-gray-400 mt-0.5">Fill in: title, language, description, image_url</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              .xlsx
            </button>
          </div>

          {/* Step 2: Upload */}
          <div>
            <p className="text-sm font-semibold text-[#0a1b39] mb-3">Step 2 — Upload filled sheet</p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
                dragging
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : file
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50',
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={onFileChange}
              />

              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                  <p className="text-xs text-emerald-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); reset() }}
                    className="mt-1 text-xs text-gray-400 underline hover:text-gray-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CloudUpload className="w-8 h-8 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-primary">Click to browse</span>{' '}
                    or drag &amp; drop
                  </p>
                  <p className="text-xs text-gray-300">.xlsx or .xls</p>
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{errorMsg}</p>
            </div>
          )}

          {/* Success result */}
          {state === 'success' && result && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Upload successful</p>
                {result.data && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {result.data.created !== undefined && `${result.data.created} created`}
                    {result.data.failed !== undefined && result.data.failed > 0 && ` · ${result.data.failed} failed`}
                  </p>
                )}
                {result.data?.errors && result.data.errors.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {result.data.errors.map((e, i) => (
                      <li key={i} className="text-xs text-red-500">{e}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition cursor-pointer"
          >
            {state === 'success' ? 'Close' : 'Cancel'}
          </button>
          {state !== 'success' && (
            <button
              onClick={handleUpload}
              disabled={!file || state === 'uploading'}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {state === 'uploading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
