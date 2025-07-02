import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterUser } from '../interfaces/register.interface';
import { Observable } from 'rxjs';
import { ApiResponseCreateInterface } from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  /**
   * @param registerUser - Servicio para enviar la información registrada al backend,
   */
  registerUser(user: RegisterUser): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}user/register`,
      user
    );
  }
}
