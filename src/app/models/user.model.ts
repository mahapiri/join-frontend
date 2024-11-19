export class User {
    userID: string = '';
    firstName: string = '';
    lastName: string = '';
    name: string = '';
    initial: string = '';
    color: string = '';
    email: string = '';
    phone?: string = '';
    readonly colors: string[] = [
        '--orange',
        '--pink',
        '--purple',
        '--purple-lighten',
        '--turquoise',
        '--salmon',
        '--orange-lighten',
        '--rosa',
        '--yellow-orange',
        '--neon-yellow',
        '--yellow',
        '--red',
        '--orange-lighten',
    ]

    constructor(obj: any) {
        this.userID = obj.userID;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.name = obj.firstName + ' ' + obj.lastName;
        this.initial = this.getInitial(obj.firstName) + this.getInitial(obj.lastName);
        this.color = this.getRandomColor();
        this.email = obj.email;
        this.phone = obj.phone || '';
    }


    getJson() {
        return {
            userID: this.userID,
            firstName: this.firstName,
            lastName: this.lastName,
            initial: this.initial,
            color: this.color,
            email: this.email,
            phone: this.phone,
        }
    }


    getRandomColor(): string {
        const randomIndex = Math.floor(Math.random() * this.colors.length);
        return this.colors[randomIndex];
    }


    getInitial(name: string) {
        if (name.length > 0) {
            return name[0];
        } else {
            console.warn('No First/Lastname found');
            return '';
        }
    }
}