import { CreateUserRelatedData } from './../../auth/interfaces/register.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatedDataService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  // registerUserRelatedData(): Observable<
  //   ApiResponseInterface<RegisterUserRelatedData>
  // > {
  //   return this._httpClient.get<ApiResponseInterface<RegisterUserRelatedData>>(
  //     `${environment.apiUrl}user/register/related-data`
  //   );
  // }

  createUserRelatedData(): Observable<
    ApiResponseInterface<CreateUserRelatedData>
  > {
    return this._httpClient.get<ApiResponseInterface<CreateUserRelatedData>>(
      `${environment.apiUrl}user/related-data/create`
    );
  }
}
