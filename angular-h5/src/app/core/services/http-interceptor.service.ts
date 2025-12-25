/**
 * HTTP 拦截器
 * 统一处理 API 响应格式，成功时返回 data 字段，失败时抛出错误
 */

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { IApiResponse } from '../../shared/models/api.model';

/**
 * HTTP 拦截器函数
 * 使用 Angular 20 的函数式拦截器 API
 */
export const httpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // 可在此处添加通用请求头，如 token
  // const authReq = req.clone({
  //   setHeaders: { Authorization: `Bearer ${getToken()}` }
  // });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ProgressEvent) {
        // 网络错误或超时
        const progressEvent = error.error as ProgressEvent;
        const message = progressEvent.type === 'timeout' ? '请求超时，请检查网络连接' : '网络错误，请检查网络连接';
        return throwError(() => new Error(message));
      }

      // API 业务错误
      const apiResponse = error.error as IApiResponse;
      if (apiResponse) {
        const errorMessage = apiResponse.message || '请求失败';
        const err = new Error(errorMessage);
        (err as any).code = apiResponse.error?.code;
        (err as any).details = apiResponse.error?.details;
        return throwError(() => err);
      }

      // 其他 HTTP 错误
      return throwError(() => new Error(`HTTP ${error.status}: ${error.message}`));
    })
  );
};

/**
 * 响应解构拦截器
 * 自动解构 IApiResponse 格式，成功时返回 data 字段
 */
export const responseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 先处理响应解构逻辑
      const apiResponse = error.error as IApiResponse;

      // 如果是业务错误（success: false），抛出错误
      if (apiResponse && !apiResponse.success) {
        const errorMessage = apiResponse.message || '请求失败';
        const err = new Error(errorMessage);
        (err as any).code = apiResponse.error?.code;
        (err as any).details = apiResponse.error?.details;
        return throwError(() => err);
      }

      // 其他错误继续抛出
      return throwError(() => error);
    })
  );
};
