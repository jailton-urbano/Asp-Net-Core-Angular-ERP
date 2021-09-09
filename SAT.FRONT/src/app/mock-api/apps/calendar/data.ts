/* eslint-disable */
import * as moment from 'moment';
moment.locale('pt-br')

export const calendars = [
    {
        id     : '1',
        title  : 'Ademir Santana',
        color  : 'bg-teal-500',
        visible: true
    },
    {
        id     : '2',
        title  : 'João Oliveira',
        color  : 'bg-indigo-500',
        visible: true
    },
    {
        id     : '3',
        title  : 'Cesar Ribeiro da Silva',
        color  : 'bg-pink-500',
        visible: true
    },
    {
        id     : '4',
        title  : 'Tiago Rosa Pimentel',
        color  : 'bg-blue-500',
        visible: true
    },
    {
        id     : '5',
        title  : 'Adriana Lorenço',
        color  : 'bg-yellow-500',
        visible: true
    }
];
export const events = [
    {
        id         : '1',
        calendarId : '1',
        title      : '6599890',
        description: 'Descrição do evento!',
        start      : moment().date(10).hour(11).minute(0).second(0).millisecond(0).toISOString(),
        end        : moment().date(10).hour(12).minute(0).second(0).millisecond(0).toISOString(),
        duration   : null,
    },
    {
        id         : '2',
        calendarId : '2',
        title      : '6599876',
        description: 'Descrição do evento!',
        start      : moment().date(11).hour(9).minute(0).second(0).millisecond(0).toISOString(),
        end        : moment().date(11).hour(10).minute(0).second(0).millisecond(0).toISOString(),
        duration   : null,
    },
    {
        id         : '3',
        calendarId : '2',
        title      : '6599109',
        description: 'Descrição do evento!',
        start      : moment().date(6).hour(12).minute(0).second(0).millisecond(0).toISOString(),
        end        : moment().date(6).hour(13).minute(0).second(0).millisecond(0).toISOString(),
        duration   : null,
    },
    {
        id         : '4',
        calendarId : '3',
        title      : '6599980',
        description: 'Descrição do evento!',
        start      : moment().date(7).hour(12).minute(0).second(0).millisecond(0).toISOString(),
        end        : moment().date(7).hour(13).minute(0).second(0).millisecond(0).toISOString(),
        duration   : null,
    },
    {
        id         : '5',
        calendarId : '4',
        title      : '6599144',
        description: 'Descrição do evento!',
        start      : moment().date(6).hour(12).minute(0).second(0).millisecond(0).toISOString(),
        end        : moment().date(6).hour(13).minute(0).second(0).millisecond(0).toISOString(),
        duration   : null,
    }
];
export const exceptions = [];
export const settings = {
    dateFormat : 'DD/MM/YYYY',
    timeFormat : '24',
    startWeekOn: 1,
    
};
export const weekdays = [
    {
        abbr : 'S',
        label: 'Segunda',
        value: 'Se'
    },
    {
        abbr : 'T',
        label: 'Terça',
        value: 'Te'
    },
    {
        abbr : 'Q',
        label: 'Quarta',
        value: 'Qu'
    },
    {
        abbr : 'Q',
        label: 'Quinta',
        value: 'Qu'
    },
    {
        abbr : 'S',
        label: 'Sexta',
        value: 'Se'
    },
    {
        abbr : 'S',
        label: 'Sábado',
        value: 'Sa'
    },
    {
        abbr : 'D',
        label: 'Domingo',
        value: 'Do'
    }
];