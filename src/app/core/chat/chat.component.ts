import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.chatInit();
  }

  private chatInit(): void {
    ((d, w, c) => {
      w.ChatraID = 'yPvYHpZ5e7hfvJAg6';
      const s = d.createElement('script');
      w[c] = w[c] || ((args) => {
        (w[c].q = w[c].q || []).push(...args);
      });
      s.async = true;
      s.src = (d.location.protocol === 'https:' ? 'https:' : 'http:')
        + '//call.chatra.io/chatra.js';
      if (d.head) { d.head.appendChild(s); }
    })(document, window, 'Chatra');
  }


}
