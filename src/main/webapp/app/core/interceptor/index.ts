import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthExpiredInterceptor } from 'app/core/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from 'app/core/interceptor/error-handler.interceptor';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthExpiredInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerInterceptor,
    multi: true,
  },
];
