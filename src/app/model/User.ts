
export class User {

    userName: string;
    userPassword: string;
    userFullName: string;
    userStatus: boolean;
    userFullAccess: boolean;

    constructor() {
        this.userName = '';
        this.userPassword = '';
        this.userFullName = '';
        this.userStatus = true;
        this.userFullAccess = true;
    }
    
}