import { logger } from "@/lib/logger";
import { AppError } from "@/lib/error-handler";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    logger.debug(`API Request: ${options.method || "GET"} ${url}`);

    try {
      // In local mode / static fallback, if fetch fails, return mock wrapper
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        throw new AppError(`HTTP Error ${response.status}: ${response.statusText}`, response.status);
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

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
