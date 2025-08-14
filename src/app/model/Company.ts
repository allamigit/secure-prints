
export class Company {
    
    companyId: number;
    companyName: string;
    companyAddress1: string;
    companyAddress2: string;
    companyPhone: string;
    companyEmail: string;
    companyHolidayStartDate: string;
    companyHolidayEndDate: string;

    constructor() {
        this.companyId = 0;
        this.companyName = '';
        this.companyAddress1 = '';
        this.companyAddress2 = '';
        this.companyPhone = '';
        this.companyEmail = '';
        this.companyHolidayStartDate = '';
        this.companyHolidayEndDate = '';
    }

}