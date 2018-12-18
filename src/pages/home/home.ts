import { Component } from '@angular/core';
import { NavController ,Platform, AlertController} from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

import * as moment from 'moment';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  notifyTime: any;
    notifications: any[] = [];
    days: any[];
    chosenHours: number;
    chosenMinutes: number;
 
    constructor(public navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications) {
 
        this.notifyTime = moment(new Date()).format();
 
        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();
 
        this.days = [
            {title: 'Segunda', dayCode: 1, checked: false},
            {title: 'Terça', dayCode: 2, checked: false},
            {title: 'Quarta', dayCode: 3, checked: false},
            {title: 'Quinta', dayCode: 4, checked: false},
            {title: 'Sexta', dayCode: 5, checked: false},
            {title: 'Sábado', dayCode: 6, checked: false},
            {title: 'Domingo', dayCode: 0, checked: false}
        ];
 
    }
 
    ionViewDidLoad(){
    }
   
    timeChange(time){
    this.chosenHours = time.hour.value;
    this.chosenMinutes = time.minute.value;
}

addNotifications(){
 console.log("CHOSENhours=",this.chosenHours);
 console.log("ChosenMINUTES",this.chosenMinutes);
 console.log("Notify time=",this.notifyTime);
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Domingo = 0, Segunda = 1; Sunday = 0, Monday = 1, etc.
 
    for(let day of this.days){
 
        if(day.checked){
 
            let firstNotificationTime = new Date();
            let dayDifference = day.dayCode - currentDay;
 
            if(dayDifference < 0){
                dayDifference = dayDifference + 7; // Para os casos onde o dia é na semana seguinte; // for cases where the day is in the following week
            }
 
            firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
            firstNotificationTime.setHours(this.chosenHours);
            firstNotificationTime.setMinutes(this.chosenMinutes);

            console.log("Primeira notificação hora = ",firstNotificationTime);

           let notification = {
                id: day.dayCode,
                title: 'ALARME',
                text: 'Hora de levantar:)',
                at: firstNotificationTime,
                every: 'Semana'
            };
            this.notifications.push(notification);
        }
    }
 
    console.log("Notificações: ", this.notifications);
 
    if(this.platform.is('cordova')){
 
        // Cancel any existing notifications
        this.localNotifications.cancelAll().then(() => {
 
            // Schedule the new notifications
            this.localNotifications.schedule(this.notifications);
 
            this.notifications = [];
 
            let alert = this.alertCtrl.create({
                title: 'Alarme configurado',
                buttons: ['Ok']
            }); 
            alert.present(); 
        }); 
    } 
}
 
    cancelAll(){
 
    this.localNotifications.cancelAll();
 
    let alert = this.alertCtrl.create({
        title: 'Alarme cancelado',
        buttons: ['Ok']
    });
 
    alert.present(); 
}
 
}
