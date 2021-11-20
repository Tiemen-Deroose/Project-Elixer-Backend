module.exports = {
    logger: {
        silent: true,
    },

    cors: {
		origins: ['http://localhost:3000'],
		maxAge: 3 * 60 * 60,
	},
};