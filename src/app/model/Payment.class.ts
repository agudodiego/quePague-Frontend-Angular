
export class Payment {

    constructor (public paymentId: number,
                 public title: string,
                 public payDate: Date,
                 public alreadyPaid: boolean,
                 public note: string) {
    }
}