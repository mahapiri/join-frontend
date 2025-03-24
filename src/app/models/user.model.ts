export class User {
    first_name: string = '';
    last_name: string = '';
    name: string = '';
    id: string = '';
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
        const nameParts = obj.name?.trim().split(/\s+/) || [''];
        this.first_name = nameParts.slice(0, -1).join(' ') || '';
        this.last_name = nameParts[nameParts.length - 1] || ''; 
        this.name = obj.name;
        this.id = obj.id || this.getRandomId();
        this.initial = (this.getInitial(obj.first_name) + this.getInitial(obj.last_name)).toUpperCase();
        this.color = this.getRandomColor();
        this.email = obj.email;
        this.phone = obj.phone || '';
    }


    getJson() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            name: this.name,
            id: this.id,
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

    getRandomId(): string {
        const randomIndex = Math.floor(Math.random() * 1_000_000_000_000_000);
        return (this.first_name || "user").toLowerCase() + randomIndex.toString();
    }
}