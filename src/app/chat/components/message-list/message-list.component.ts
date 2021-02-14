import { Component, OnInit } from '@angular/core';
import { MessageService } from '@core/services/message.service';
import { Message } from '@core/model/message.model';
import { FormBuilder, Validators } from '@angular/forms';
import { SendMessageDto } from '@core/dto/send-message.dto';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  constructor(
      private messageService: MessageService,
      private formBuilder: FormBuilder
  ) {
  }

  messagesById: Map<string, Message> = new Map();

  editingMessageId: string | null = null;

  messageForm = this.formBuilder.group({
    text: ['', Validators.required],
  });

  ngOnInit(): void {
    this.messageService.getAll()
        .subscribe(messages => {
          this.messagesById = messages
              .reduce((acc, m) => acc.set(m.id, m), new Map());
        });
  }

  getMessages(): Message[] {
    return Array.from(this.messagesById.values());
  }

  startEditMessage(id: string): void {
    this.editingMessageId = id;
    this.messageForm.setValue({
      text: this.getMessage(id).text,
    });
  }

  sendMessage(): void {
    const dto: SendMessageDto = this.messageForm.value;
    const observable = this.editingMessageId !== null
        ? this.messageService.put(this.editingMessageId, dto)
        : this.messageService.save(dto);

    observable.subscribe(message => {
      this.addMessage(message);
      this.messageForm.reset();
      this.editingMessageId = null;
    });
  }

  deleteMessage(id: string): void {
    this.messageService.delete(id)
        .subscribe(() => this.messagesById.delete(id));
  }

  private addMessage(message: Message): void {
    this.messagesById.set(message.id, message);
  }

  private getMessage(id: string): Message {
    const message = this.messagesById.get(id);

    if (!message) {
      throw new Error(`Message with id ${id} is undefined`);
    }

    return message;
  }

}
