import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  toggleRegister(event) {
    console.log('event triggered ' + event);
    // $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  }
}
