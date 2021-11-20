const logger = require('../core/logging');
const uuid = require('uuid');
let { ART_DATA } = require('../data/mock-data');

const checkAttributes = (action, title, material, medium, size, image_url, price) => {
	const stringAttributes = [title, material, medium, size, image_url];
	let isCorrect = true;

	stringAttributes.forEach(attribute => {
		if (typeof attribute !== 'string') {
			logger.error({ message: `Could not ${action} art: expected string, but got ${typeof attribute} '${attribute}'`});
			isCorrect = false;
		};
	});

	if (typeof price !== 'number')
	{
		logger.error({ message: `Could not ${action} art: attribute 'price' must be a number`});
		isCorrect = false;
	};

	return isCorrect;
};

const findArtById = (action, id) => {
	const foundArt = ART_DATA.find(art => 
		art.id === id
	);

	if (!foundArt)
		logger.error({ message: `Could not ${action} art: art with id '${id}' does not exist`});
	
	return foundArt;
};

const getAll = () => {
	return { data: ART_DATA, count: ART_DATA.length };
};
const getById = (id) => {  
    const requestedArt = findArtById("update", id);

	return requestedArt ?? null; // if requested art wasn't found, return null instead
};
const create = ({title, material, medium, size, image_url, price}) => {
	if (!checkAttributes("create", title, material, medium, size, image_url, price))
		return null;

	const createdArt = {
		id: uuid.v4(),
		title,
		material,
		medium,
		size,
		image_url,
		price,
	};

	ART_DATA.push(createdArt);
	return createdArt;
};
const updateById = (id, {title, material, medium, size, image_url, price}) => {
	if (!checkAttributes("update", title, material, medium, size, image_url, price))
		return null;

	updatedArt = findArtById("update", id);

	if (requestedArt) {
		updatedArt.title = title;
		updatedArt.material = material;
		updatedArt.medium = medium;
		updatedArt.size = size;
		updatedArt.image_url = image_url;
		updatedArt.price = price;
	}

	return updatedArt ?? null; // if requested art wasn't found, return null instead
};
const deleteById = (id) => {
	const artToDelete = findJewelryById("delete", id);

	if (artToDelete)
		ART_DATA.splice(ART_DATA.indexOf(artToDelete), 1);

	return artToDelete ?? null; // if requested art wasn't found, return null instead
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};