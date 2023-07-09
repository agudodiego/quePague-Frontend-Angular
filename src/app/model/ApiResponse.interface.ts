import { BasicPersonResponse } from "./BasicPersonResponse.class";
import { Payment } from "./Payment.class";
import { PersonResponse } from "./PersonResponse.class";

export interface ApiResponse {

    success: string;
    message: string;
    data: PersonResponse | BasicPersonResponse[] | string | Payment
}