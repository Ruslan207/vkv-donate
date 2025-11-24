import { Injectable } from '@angular/core';
import { Jar, TransactionStatus, UpdateMessage } from 'models';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private token: string | undefined;
  private eventSource: EventSource | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  async getJars(): Promise<Jar[]> {
    if (!this.token) {
      throw new Error('Token is not set');
    }
    const res = await fetch(`${this.baseUrl}/jars`, {
      headers: {
        token: this.token,
      },
    });
    if (!res.ok) throw new Error('Unable to load jars');
    return (await res.json()) as Promise<Jar[]>;
  }

  subscribeOnJar(jarId: string): Observable<UpdateMessage> {
    const eventSource = new EventSource(`${this.baseUrl}/jars/${jarId}`);
    this.eventSource = eventSource;

    return new Observable((subscriber: Subscriber<UpdateMessage>) => {
      eventSource.onerror = (error) => {
        subscriber.error(error);
      };

      eventSource.addEventListener('message', (data: MessageEvent<string>) => {
        subscriber.next(JSON.parse(data.data) as UpdateMessage);
      });
    });
  }

  unsubscribeFromJar(): void {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.close();
    this.eventSource = null;
  }

  setTransactionStatus(
    transactionId: string,
    status: TransactionStatus
  ): Promise<void> {
    return fetch(`${this.baseUrl}/transactions/${transactionId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }).then();
  }
}
