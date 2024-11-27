import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService 
{
  private componentRef!: ComponentRef<ModalComponent>
  private componentSubscriber!: Subject<string>

  openModal(entry: ViewContainerRef, modalTitle: string) {
    this.componentRef = entry.createComponent(ModalComponent)
    this.componentRef.instance.title = modalTitle
    this.componentRef.instance.closeMeEvent.subscribe(() => this.closeModal())
    this.componentRef.instance.confirmEvent.subscribe(() => this.confirm())
    this.componentSubscriber = new Subject<string>()
    return this.componentSubscriber.asObservable()
  }
  

  closeModal() {
    this.componentSubscriber.complete()
    this.componentRef.destroy()
  }

  confirm() {
    this.componentSubscriber.next('confirm')
    this.closeModal()
  }
}
