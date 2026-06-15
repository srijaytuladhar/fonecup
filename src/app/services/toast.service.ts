import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type };
    this.toastsSubject.next([...this.toastsSubject.value, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 4000) {
    this.show(message, 'info', duration);
  }

  remove(id: string) {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}
