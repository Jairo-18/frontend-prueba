import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../shared/interfaces/api-response.interface';
import { CreateUserPanel, UserComplete } from '../interfaces/create.interface';
import { PaginationInterface } from '../../shared/interfaces/pagination.interface';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtilities: HttpUtilitiesService =
    inject(HttpUtilitiesService);

  getUserWithPagination(query: object): Observable<{
    pagination: PaginationInterface;
    data: UserComplete[];
  }> {
    const params = this._httpUtilities.httpParamsFromObject(query);
    return this._httpClient.get<{
      pagination: PaginationInterface;
      data: UserComplete[];
    }>(`${environment.apiUrl}user/paginated-list`, { params });
  }

  getUserEditPanel(
    userId: string
  ): Observable<ApiResponseInterface<UserComplete>> {
    return this._httpClient.get<ApiResponseInterface<UserComplete>>(
      `${environment.apiUrl}user/${userId}`
    );
  }

  updateUserProfile(userId: string, body: unknown): Observable<void> {
    return this._httpClient.patch<void>(
      `${environment.apiUrl}user/${userId}`,
      body
    );
  }

  createUser(user: CreateUserPanel): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}user/register`,
      user
    );
  }

  updateUser(userId: string, body: unknown): Observable<void> {
    return this._httpClient.patch<void>(
      `${environment.apiUrl}user/${userId}`,
      body
    );
  }

  deleteUserPanel(userId: string): Observable<unknown> {
    return this._httpClient.delete(`${environment.apiUrl}user/${userId}`);
  }
}
