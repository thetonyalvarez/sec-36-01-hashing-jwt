# Messagely

## Table of Contents
- [Using The App](#using-the-app)
    - [Create a user](#create-a-user)
    - [Logging In](#logging-in)

## Using The App

### Create a user
To create a user, send a `POST` request to the following endpoint:

```console
$ curl http://localhost:3000/auth/register -X POST
```

with the following body:
```json
{
	"username": "test_username",
	"password": "123456",
	"first_name": "test_f",
	"last_name": "test_l",
	"phone": "3105551212"
}
```

You'll then receive a response with a token:
```json
{
	"token": "eyJhbGciOiJIUzI........6Owg"
}
```

### Logging in
If you have existing login details, you can login by sending a `POST` request to the following endpoint:

```console
$ curl http://localhost:3000/auth/login -X POST
```

with your login details in the body of the request:
```json
{
	"username": "test_username",
	"password": "123456"
}
```

You'll then receive a response with a token:
```json
{
	"token": "eyJhbGciOiJIUzI........6Owg"
}