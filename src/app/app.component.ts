import { Component, OnInit, DoCheck, ChangeDetectorRef, OnChanges, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RequestOptions, Request, RequestMethod, Headers} from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit, DoCheck, OnChanges  {

  public urlRequest = 'http://localhost:1026';
  public urlHistory = 'http://sth-comet:8666/notify';
  public urlHistoryExternal = 'http://localhost:8666';

  public needleValue = 65;
  public range = ['0', '100'];
  public service;
  public subservice;
  public context = [];
  public entities = [];
  public entitiesList = [];
  public entitiesSelected;
  public selectedEntity = {};
  public attributes = [];
  public deviceValue = 'OFF';
  public deviceEntity;
  public deviceType;
  public deviceAttribute;
  public showCommands = false;
  public showConfig = false;
  public showNotify = false;
  public interval;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params && params.s) {
        this.service = params.s;
      } else {
        this.service = 'service';
      }

      if (params && params.ss) {
        this.subservice = params.ss;
      } else {
        this.subservice = '/subservice';
      }
    });

    this.getEntity();
  }

  ngDoCheck(): void {
    this.cd.detectChanges();
  }

  ngOnChanges() {
    this.cd.detectChanges();
  }

  getEntity() {
    this.httpClient.get(this.urlRequest + '/v2/entities/', {
      headers: {'fiware-servicepath': this.subservice, 'fiware-service': this.service}
   }).subscribe((data) => {
     const res = Object.values(data);
     if (res) {
      this.entitiesList = [];
      for (let i = 0; i < res.length; i++) {
        const obj = {type: res[i].type, id: res[i].id};
        this.entitiesList.push(obj);
      }
     }
    });
  }

  changeSelectEntity($event) {
    this.entitiesSelected = $event;
    this.entities = [];
    this.context = [];
    if(this.interval){
      clearInterval(this.interval);
    }
    if(this.entitiesSelected){
      this.interval = setInterval(() => { this.getRequest(this.entitiesSelected);}, 1000);
    } else {
      alert('Selecione uma Entidade')
    }
  }


  getRequest(id) {
    this.httpClient.get(this.urlRequest + '/v2/entities/'+id, {
      headers: {'fiware-servicepath': this.subservice, 'fiware-service': this.service}
   }).subscribe((data) => {

    let res = [data];

     if (res) {
      const i=0;
      //for (let i = 0; i < res.length; i++) {
        const obj = {type: res[i]['type'], id: res[i]['id'] };
        if(res[i]['TimeInstant']){
          obj['time'] = new Date(res[i]['TimeInstant'].value);
        }
        let search = null;
        if(res[i]['id']){
          search = this.context.find(z => z.id === res[i]['id']);
        }
        if (search) {
          if(res[i]['TimeInstant'] && res[i]['TimeInstant'].value){
            search.time = res[i]['TimeInstant'].value;
          }
          const item = JSON.parse(JSON.stringify(res[i]));
          search['elem'] = item;
        } else {
          const item = JSON.parse(JSON.stringify(res[i]));
          delete item['TimeInstant'];
          delete item['id'];
          delete item['type'];

          obj['elem'] = item;
          const entity = {name: res[i]['id'], type: res[i]['type'], values: this.getObject(item)};
          this.entities.push(entity);
          this.context.push(obj);
        //}
      }
     }
    });
  }

  changeSelect($event) {
    this.attributes = [];
    if ($event) {
      const array = this.entities.find(x => x.name === $event);
      if(array){
        this.deviceType = array.type;
        this.attributes = array.values;
      }
    }
  }

  isNumber(value) {
    const array = ['number', 'float', 'int'];
    if (array.indexOf(value) >= 0) {
      return true;
    }
    return false;
  }

  isText(value) {
    const array = ['string', 'Text', 'commandResult', 'commandStatus'];
    if (array.indexOf(value) >= 0) {
      return true;
    }
    return false;
  }

  execute() {
   const body = `{
    "actionType": "UPDATE",
    "entities": [
      {
        "type": "` + this.deviceType + `",
        "id": "` + this.deviceEntity + `",
        "` + this.deviceAttribute + `": {
          "value": "` + this.deviceValue + `"
        }
      }
     ]
    }`;

    this.httpClient.post(this.urlRequest + '/v2/op/update', JSON.parse(body), {
      headers: {'fiware-servicepath': this.subservice, 'fiware-service': this.service}
   }).subscribe((data) => {
     this.showCommands = false;
    });

  }

  getObject(obj) {
    return Object.keys(obj);
  }

  history() {

    if (!this.urlHistory) {
      alert("Preencha a URL")
    }

    if (!this.deviceType) {
      alert("Tipo do dispositivo não encontrado!");
    }

    const attributes = '"' + this.attributes.join('","') + '"';
    const body = `{
      "description": "Notify STH-Comet of all Motion Sensor count changes",
      "subject": {
        "entities": [
          {
            "id": "` + this.deviceEntity + `",
            "type": "` + this.deviceType + `"
          }
        ],
        "condition": {"attrs": [` + attributes + `] }
      },
      "notification": {
        "http": {
          "url": "` + this.urlHistory + `"
        },
        "attrs": [
          ` + attributes + `
        ],
        "attrsFormat": "legacy"
      }
    }`;

      this.httpClient.post(this.urlRequest + '/v2/subscriptions/', JSON.parse(body), {
        headers: {'fiware-servicepath': this.subservice, 'fiware-service': this.service}
     }).subscribe((data) => {
       this.showCommands = false;
      });

  }


  view(entity, obj) {
    const url = '/STH/v1/contextEntities/type/' + entity.type + '/id/' + entity.id + '/attributes/' + obj + '?lastN=15';
    this.httpClient.get(this.urlHistoryExternal + url, {
      headers: {'Access-Control-Allow-Origin': 'http://localhost:4200/'}
    }).subscribe((data) => {
      console.log("data", data)
    });

  }
}
