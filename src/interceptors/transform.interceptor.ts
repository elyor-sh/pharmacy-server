import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {writeLogs} from "../utils/writeLogs";

export interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

        const req = context.switchToHttp().getRequest()

        writeLogs(req)

        return next.handle().pipe(map(data => {

            const paging = null

            return {
                paging,
                ...data
            }
        }));
    }
}