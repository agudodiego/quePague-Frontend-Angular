import { Payment } from '../model/Payment.class'

export class PersonResponse {

    constructor(public username: string,
                public payments: Payment[]) {}

}