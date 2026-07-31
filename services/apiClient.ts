import { logger } from "@/lib/logger";
import { AppError } from "@/lib/error-handler";
import { supabase } from "@/lib/supabase/client";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || "") {
    this.baseUrl = baseUrl;
  }

  /** Fetch the current Supabase access token to authorize backend requests. */
  private async getAuthToken(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    } catch (error) {
      logger.error("Failed to read Supabase session", error);
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    logger.debug(`API Request: ${options.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        throw new AppError(`HTTP Error ${response.status}: ${response.statusText}`, response.status);
      }
      // 204 No Content has no body to parse.
      if (response.status === 204) {
        return { data: undefined as T, success: true };
      }
      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      logger.error(`API Error on ${url}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
