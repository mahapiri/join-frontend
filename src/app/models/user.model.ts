export class User {
    firstName: string = '';
    lastName: string = '';
    name: string = '';
    userID: string = '';
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
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.name = obj.firstName + ' ' + obj.lastName;
        this.userID = obj.userID || this.getRandomUserID(obj.firstName);
        this.initial = this.getInitial(obj.firstName) + this.getInitial(obj.lastName);
        this.color = obj.color || this.getRandomColor();
        this.email = obj.email;
        this.phone = obj.phone || '';
    }


    getJson() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            name: this.name,
            userID: this.userID,
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

    getRandomUserID(firstName: string): string {
        const randomIndex = Math.floor(Math.random() * 1000000000000000);
        return firstName.toLocaleLowerCase() + randomIndex.toString();
    }
}