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

  private async handleResponse<TResponse>(res: Response): Promise<TResponse> {
    if (res.status === 401) {
      globalThis.location.href = '/login'
    }
    const text = await res.text()
    if (!res.ok) throw new ApiError(res.status, text)
    return JSON.parse(text) as TResponse
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    return this.handleResponse<TResponse>(res)
  }

  async post<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return this.handleResponse<TResponse>(res)
  }

  async put<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return this.handleResponse<TResponse>(res)
  }

  async patch<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return this.handleResponse<TResponse>(res)
  }

  async postFile<TResponse>(path: string, formData: FormData): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      // No Content-Type header — browser sets it with the correct boundary
      body: formData,
    })
    return this.handleResponse<TResponse>(res)
  }

  async delete<TResponse>(path: string): Promise<TResponse> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    return this.handleResponse<TResponse>(res)
  }
}
