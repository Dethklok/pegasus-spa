import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '@core/model/message.model';
import { SendMessageDto } from '@core/dto/send-message.dto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  apiServerUrl = 'http://localhost:8080/api/v1';

  constructor(
    private http: HttpClient
  ) {
  }

  getAll(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiServerUrl}/message`);
  }

  save(messageDto: SendMessageDto): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiServerUrl}/message`,
      messageDto,
    );
  }

  put(id: string, messageDto: SendMessageDto): Observable<Message> {
    return this.http.put<Message>(
        `${this.apiServerUrl}/message/${id}`,
        messageDto,
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/message/${id}`);
  }
}
