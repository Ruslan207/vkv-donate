import { inject, Injectable, NgZone } from '@angular/core';
import { Jar } from '../../../../models/jar';
import { Observable, Subscriber } from 'rxjs';
import { UpdateMessage } from '../../../../models/update-message';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private zone = inject(NgZone);

  private baseUrl = './api';
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
        token: this.token
      }
    });
    if (!res.ok) throw new Error("Unable to load jars");
    return await res.json() as Promise<Jar[]>;
  }

  subscribeOnJar(jarId: string): Observable<UpdateMessage> {
    const eventSource = new EventSource(`${this.baseUrl}/jars/${jarId}`);
    this.eventSource = eventSource;

    return new Observable((subscriber: Subscriber<UpdateMessage>) => {
      eventSource.onerror = error => {
        this.zone.run(() => subscriber.error(error));
      };

      eventSource.addEventListener('topup', (data: MessageEvent<UpdateMessage>) => {
        this.zone.run(() => subscriber.next(data.data));
      });
    });
  }

  close(): void {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.close();
    this.eventSource = null;
  }
}
