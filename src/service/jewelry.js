const logger = require('../core/logging');
const uuid = require('uuid');

const database = require('../data');
const collections = database.collections;

function checkAttributes(action, name, category, material, colour, image_url, price) {
	const stringAttributes = [name, category, material, colour, image_url];
	let isCorrect = true;

	var counter = 0;
	stringAttributes.forEach(attribute => {
		counter++;
		if (typeof attribute !== 'string' || !attribute) {
			logger.error({ message: `Could not ${action} jewelry: expected string, but got ${typeof attribute} '${attribute}' on property number ${counter}`});
			isCorrect = false;
		};
	});

	if (typeof price !== 'number')
	{
		logger.error({ message: `Could not ${action} jewelry: attribute 'price' must be a number`});
		isCorrect = false;
	};

	return isCorrect;
};

async function getAll() {
	const response = await database.getAll(collections.jewelry);

	return { data: response, count: response.length };
};
async function getById(id) {  
    const requestedJewelry = database.getById(collections.jewelry, id);

	return requestedJewelry ?? null; // if requested jewelry wasn't found, return null instead
};
async function create({name, category, material, colour, image_url, price}) {
	if (!checkAttributes("create", name, category, material, colour, image_url, price))
		return null;

	const createdJewelry = {
		_id: uuid.v4(),
		name: name,
		category,
		material,
		colour,
		image_url,
		price,
	};

	database.create(collections.jewelry, createdJewelry);
	return createdJewelry;
};
async function updateById(id, {name, category, material, colour, image_url, price}) {
	if (!checkAttributes("update", name, category, material, colour, image_url, price))
		return null;

	updatedJewelry = database.updateById(collections.jewelry, id, {name, category, material, colour, image_url, price});

	return updatedJewelry ?? null; // if requested jewelry wasn't found, return null instead
};
async function deleteById(id) {
	const jewelryToDelete = database.deleteById(collections.jewelry, id);

	return jewelryToDelete ?? null; // if requested jewelry wasn't found, return null instead
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};