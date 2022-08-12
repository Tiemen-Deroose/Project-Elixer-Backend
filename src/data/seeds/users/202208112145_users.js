const roles = require('../../../core/roles');

module.exports = [
  {
    _id: '34fc5a81-4df2-49d0-9d85-bba07522d401',
    username: 'user1',
    email: 'user1@domain.com',
    password: '$argon2id$v=19$m=131072,t=6,p=1$9gx6OK5Id0v9tBIGX8YvgA$Qsyvc0DduGVjbmrh97Px/Q', //pass1
    roles: [roles.ADMIN, roles.USER],
    favourites: [],
  },
  {
    _id: '5e9dd8ca-257b-4dbb-bd2d-9d93af902e25',
    username: 'user2',
    email: 'user2@domain.com',
    password: '$argon2id$v=19$m=131072,t=6,p=1$IbfcEi81JuUlIvaG4YToCg$PYxGGQ99H7P9NNN0zjCKwg', //pass2
    roles: [roles.USER],
    favourites: [],
  },
];