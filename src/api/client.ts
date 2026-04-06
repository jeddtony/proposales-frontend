export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async get<TResponse>(path: string): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json() as Promise<TResponse>
  }

  async post<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json() as Promise<TResponse>
  }

  async put<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json() as Promise<TResponse>
  }

  async patch<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json() as Promise<TResponse>
  }

  async postFile<TResponse>(path: string, formData: FormData): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      // No Content-Type header — browser sets it with the correct boundary
      body: formData,
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json() as Promise<TResponse>
  }

  async delete<TResponse>(path: string): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new ApiError(res.status, await res.text())
    return res.json() as Promise<TResponse>
  }
}
