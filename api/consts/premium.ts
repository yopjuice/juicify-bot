interface IPremium {
	id: number, 
	name: string,
	price: number,
	decription?: string,
}

export const premium: IPremium[] = [
	{
		id: 1,
		name: 'Basic Premium',
		price: 100,
		decription: 'Get all features of Juicify',
	},
	{
		id: 2,
		name: 'Mega Premium',
		price: 200,
		decription: 'Get all features of Juicify',
	},
	{
		id: 2,
		name: 'Ultra Premium',
		price: 300,
		decription: 'Get all features of Juicify',
	}
]