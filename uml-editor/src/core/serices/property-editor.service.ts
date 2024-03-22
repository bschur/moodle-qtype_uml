import { computed, Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class PropertyEditorService {
  readonly showPropertyEditor = computed(() => this.showPropertyEditorSignal())

  private readonly showPropertyEditorSignal = signal(false)

  show() {
    this.showPropertyEditorSignal.set(true)
  }

  close() {
    this.showPropertyEditorSignal.set(false)
  }
}
