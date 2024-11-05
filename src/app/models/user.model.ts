export class User {
    userID: string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phone?: string = '';

    constructor(obj: any) {
        this.userID = obj.userID;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj. email;
        this.phone = obj.phone || '';
    }

    getJson() {
        return {
            userID: this.userID,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
        }
    }
}