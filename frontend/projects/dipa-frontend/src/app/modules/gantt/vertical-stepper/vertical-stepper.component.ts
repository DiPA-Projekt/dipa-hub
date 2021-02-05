import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-vertical-stepper',
  templateUrl: './vertical-stepper.component.html',
  styleUrls: ['./vertical-stepper.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class VerticalStepperComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;

  statusList = [
    {
      value: 'IN_PROGRESS',
      name: 'in Bearbeitung',
    },
    {
      value: 'OPEN',
      name: 'offen',
    },
    {
      value: 'CLOSED',
      name: 'geschlossen',
    },
    {
      value: 'ASSIGNED',
      name: 'zugewiesen',
    },
    {
      value: 'PLANNED',
      name: 'geplant',
    },
    {
      value: 'DONE',
      name: 'fertiggestellt',
    },
  ];

  stepperData = [
    {
      title: 'Übergabe TLM-->PL',
      optional: false,
      explanation: '',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Übergabe IIA11-->PL',
      optional: false,
      explanation: 'angelegtes iSAR-Projekt mit vorausgefülltem PSB',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Besetzung iSAR durchführen',
      optional: true,
      explanation: 'sofern weitere Projektmitglieder auf das AKZ Zeiten zurückmelden sollen',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Ansprechpartner der Referate ermitteln, die den Auftragsgegenstand umsetzen',
      optional: false,
      explanation: '',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'regelmäßiger JourFix vereinbaren',
      optional: true,
      explanation: '',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Dokumentationsort festlegen',
      optional: false,
      explanation: 'festlegen, wo projektrelevante Dokumente abgelegt werden',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'eAkte',
      explanation: '',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'ELBE Einkaufswagen anlegen',
      optional: true,
      explanation:
        'sofern Beschaffungen notwendig sind und diese nicht durch den Leistungsbereich erstellt werden (z.B. ext. DL)',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'AeDL einrichten und monatliche Leistungsnachweise freigeben',
      optional: true,
      explanation:
        'sofern ext. Dienstleistung eingesetzt wird, muss AeDL dafür administriert werden und die monatlichen Leistungsnachweise der Externen sind freizugeben und an den DL weiterzuleiten',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Trackingtabelle externe Dienstleistung pflegen',
      optional: true,
      explanation: 'Abfluss der Aufwände und Zahlungen tracken',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Arbeitsmittel für ext. DL bestellen und einrichten (Servista etc.)',
      optional: true,
      explanation:
        'sofern ext. Dienstleistung eingesetzt wird, müssen notwendige Arbeitsmittel (Servista, Verpflichtung etc.) besorgt werden',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'monatlichen Statusbericht erstellen und versenden',
      optional: false,
      explanation:
        'bis zum 10. eines Kalendermonats muss in iSAR ein Statusbericht für den vorangegangenen Berichtsmonat erstell und durch den PE freigegeben werden',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Termine setzen und steuern',
      optional: true,
      explanation:
        'Projektablauf mit internen Terminen strukturieren, Termineinhaltung überprüfen und Auswirkungen von Terminüberschreitungen steuern',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Risiken',
      optional: true,
      explanation: 'Risikosteuerung durch diese Risikoliste, Bildung von Abstellmaßnahmen',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Eskalationen durchführen',
      optional: true,
      explanation: '',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Auftragsänderung (Change Request) erstellen',
      optional: true,
      explanation: 'sR bei Ressourcenmanagement und BfdH notwendig',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
    {
      title: 'Erledigungsanzeige erstellen und versenden',
      optional: false,
      explanation: 'sR bei Ressourcenmanagement und BfdH notwendig',
      contactPerson: '',
      documentationLink: '',
      result: '',
      status: '',
    },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      contactPersonCtrl: [''],
      documentationLinkCtrl: [''],
      resultCtrl: [''],
      statusCtrl: [''],
    });
  }
}
