
import { ApiStatus } from '@models/ApiStatus';
import { AppointmentResponse } from '@models/AppointmentResponse';

export class ApiResponse<T = any> {

    apiStatus: ApiStatus;
    apiResponseEntity: T;

    constructor() {
        this.apiStatus = new ApiStatus();
        this.apiResponseEntity = {} as T;
    }

}