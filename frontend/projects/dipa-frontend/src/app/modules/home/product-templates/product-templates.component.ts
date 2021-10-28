import { Component, OnInit } from '@angular/core';
import { ExternalLink } from 'dipa-api-client';

interface Discipline {
  id: number;
  title: string;
  links?: Array<ExternalLink>;
}

@Component({
  selector: 'app-product-templates',
  templateUrl: './product-templates.component.html',
  styleUrls: ['./product-templates.component.scss'],
})
export class ProductTemplatesComponent implements OnInit {
  public disciplines: Discipline[] = [];

  public ngOnInit(): void {
    this.disciplines = [
      {
        id: 1,
        title: '1.1 Anbahnung und Organisation',
        links: [
          {
            id: 8,
            name: 'Informationssicherheits-Navigator',
            url: '',
          },
        ],
      },
      {
        id: 2,
        title: '1.2 Planung und Steuerung',
      },
      {
        id: 3,
        title: '1.3 Risikomanagement',
        links: [
          {
            id: 5,
            name: 'Risikoliste',
            url: '',
          },
        ],
      },
      {
        id: 4,
        title: '1.4 Problem- und Änderungsmanagement',
      },
    ];
  }
}
