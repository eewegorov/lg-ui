import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
      (function(d, w, c) {
        w.ChatraID = 'yPvYHpZ5e7hfvJAg6';
        var s = d.createElement('script');
        w[c] = w[c] || function() {
          (w[c].q = w[c].q || []).push(arguments);
        };
        s.async = true;
        s.src = (d.location.protocol === 'https:' ? 'https:': 'http:')
          + '//call.chatra.io/chatra.js';
        if (d.head) d.head.appendChild(s);
      })(document, window, 'Chatra');
  }

}
