import { Component, OnInit } from '@angular/core';
import { AdresseService } from 'dipa-api-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  adressen$ = this.adresseService.adresseGet();

  constructor(private adresseService: AdresseService) { }

  ngOnInit(): void {
  }

}
