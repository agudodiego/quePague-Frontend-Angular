
export class Payment {

    constructor (public paymentId: number,
                 public title: string,
                 public payDate: string | null,
                 public alreadyPaid: boolean,
                 public isPayMonth: number,
                 public note: string) {
    }
}