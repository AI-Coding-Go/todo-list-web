/**
 * Axios 请求封装
 * 配置 axios 实例、请求/响应拦截器，统一处理 API 调用
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { IApiResponse } from '@/types/api'

// 从环境变量读取 API 基础地址
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 创建 axios 实例
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 * 在请求发送前进行处理，可添加通用请求头等
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可在此处添加 token 等认证信息
    // const token = localStorage.getItem('token')
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理 API 响应格式，成功时返回 data 字段，失败时抛出错误
 */
axiosInstance.interceptors.response.use(
  (response): any => {
    const apiResponse = response.data as IApiResponse

    // 请求成功
    if (apiResponse.success) {
      return apiResponse.data
    }

    // 业务错误，抛出错误信息
    const error = new Error(apiResponse.message || '请求失败')
    ;(error as any).code = apiResponse.error?.code
    ;(error as any).details = apiResponse.error?.details
    return Promise.reject(error)
  },
  (error: AxiosError) => {
    // HTTP 错误（网络错误、超时等）
    const message = error.response
      ? `HTTP ${error.response.status}: ${error.message}`
      : error.message === 'timeout'
        ? '请求超时，请检查网络连接'
        : '网络错误，请检查网络连接'

    const normalizedError = new Error(message)
    ;(normalizedError as any).originalError = error
    return Promise.reject(normalizedError)
  }
)

export default axiosInstance
