let { JEWELRY_DATA } = require('../data/mock-data');
const uuid = require('uuid');

const checkAttributes = (action, name, category, material, colour, price) => {
	const stringAttributes = [name, category, material, colour];
	let isCorrect = true;

	stringAttributes.forEach(attribute => {
		if (typeof attribute !== 'string' || !attribute) {
			console.log(`Could not ${action} jewelry: expected string, but got ${typeof attribute} '${attribute}'`); // TODO: implement winston logger here
			isCorrect = false;
		};
	});

	if (typeof price !== 'number')
	{
		console.log(`Could not ${action} jewelry: attribute 'price' must be a number`); // TODO: implement winston logger here
		isCorrect = false;
	};

	return isCorrect;
};

const findJewelryById = (action, id) => {
	const foundJewelry = JEWELRY_DATA.find(jewelry => 
		jewelry.id === id
	);

	if (!foundJewelry)
		console.log(`Could not ${action} jewelry: jewelry with id '${id}' does not exist`); // TODO: implement winston logger here
	
	return foundJewelry;
}

const getAll = () => {
	return { data: JEWELRY_DATA, count: JEWELRY_DATA.length };
};

const getById = (id) => {  
    const requestedJewelry = findJewelryById("update", id);

	return requestedJewelry ?? null; // if requested jewelry wasn't found, return null instead
};
const create = ({name, category, material, colour, price}) => {
	if (!checkAttributes("create", name, category, material, colour, price))
		return null;

	const createdJewelry = {
		id: uuid.v4(),
		name: name,
		category,
		material,
		colour,
		price,
	};

	JEWELRY_DATA.push(createdJewelry);
	return createdJewelry;
};
const updateById = (id, {name, category, material, colour, price}) => {
	if (!checkAttributes("update", name, category, material, colour, price))
		return null;

	updatedJewelry = findJewelryById("update", id);

	if (updatedJewelry) {
		updatedJewelry.name = name;
		updatedJewelry.category = category;
		updatedJewelry.material = material;
		updatedJewelry.colour = colour;
		updatedJewelry.price = price;
	}

	return updatedJewelry ?? null; // if requested jewelry wasn't found, return null instead
};
const deleteById = (id) => {
	const jewelryToDelete = findJewelryById("delete", id);

	if (jewelryToDelete)
		JEWELRY_DATA.splice(JEWELRY_DATA.indexOf(jewelryToDelete), 1);

	return jewelryToDelete ?? null; // if requested jewelry wasn't found, return null instead
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};