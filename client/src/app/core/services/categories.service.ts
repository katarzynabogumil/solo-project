import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ApiResponseCommentModel, CommentModel, CommentDictModel, RequestConfigModel, ApiResponseCommentDictModel, ApiResponseExpCategoryModel, ExpCategoryModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(
    public api: ApiService,
  ) { }

  changeCatOrderId = (categoryId: number, newOrderId: number): Observable<ApiResponseExpCategoryModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/categories/${categoryId}/${newOrderId}`,
      method: 'PUT',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpCategoryModel;
        const error = response.error;

        return of({
          data: data,
          error,
        });
      }))
      ;
  };
}