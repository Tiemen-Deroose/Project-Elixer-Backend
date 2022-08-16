# Elixer API

This is the RESTful node.js API for my elixer project, which communicates with a mongoDB database.

## How to start

### `Online`

If you would like to simply do API calls on the online hosted server, you can simply do this by sending them to https://td-elixer-api.herokuapp.com/api

### `Local`

### MongoDB

If you would like to run this API locally, you'll need a mongoDB server running locally (this project was made using mongoDB Community Server 5.0, but higher versions may work just fine)

### Environment configuration

To start this API locally, create a `.env` file in the root of this project with these configuration lines:

```
NODE_ENV="development"
JWT_SECRET="kFwh9kP1YIHwl65C102luiGj0CkuWOjSVhuyw4VPEx07GSbcWg41XSdYhP9pTYAJtS4QO"
```
Optional variables:
```
DATABASE_NAME="elixer"
DATABASE_CLIENT="mongodb"
DATABASE_HOST="localhost"
DATABASE_PORT="27017"
DATABASE_USERNAME="root"
DATABASE_PASSWORD=""
```

If you would like to run the tests, simply create a `.env.test` file in the same location with the same configuration, but make sure to redefine the following variables;
```
NODE_ENV="test"
DATABASE_NAME="elixer_test"
```

### Running the API

Make sure to first run `yarn install` in order to install the dependencies.  
Afterwards, you can start the API with `yarn start`.

## API Call List

*Note: All API calls require a `Bearer token` which can be acquired by successfully logging in.*

Get All:
- GET request on `/art /jewelry /users`  
- Optional parameters: `?limit={number}&offset={number}`

Get By Id:
- GET request on `/art/{id} /jewelry/{id} /users/{id}`  

Create:
- POST request on `/art /jewelry` 
- Art Body: { title, material, medium, size, image_url, price }
- Jewelry Body: { name, category, material, colour, image_url, price }

Update:
- PUT request on `/art/{id} /jewelry/{id} /users/{id}`  
- Art Body: { title, material, medium, size, image_url, price }
- Jewelry Body: { name, category, material, colour, image_url, price }
- User Body: { username, email, password, roles, favourites }

Delete:
- DELETE request on `/art/{id} /jewelry/{id} /users/{id}`  

Login:
- POST request on `/users/login`  
- Body: { email, password }

Register:
- POST request on `/users/register`
- Body: { username, email, password }

Add Favourite:
- PUT request on `/users/favourite/{id}`  
- Body: { itemId }

Remove Favourite:
- DELETE request on `/users/favourite/{id}`  
- Body: { itemId }

## Known issues

* Custom .env variables may fail to load when launching from a vscode terminal. If this occurs, try loading the project from powershell instead.