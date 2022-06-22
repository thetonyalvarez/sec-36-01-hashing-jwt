# Messagely

## Table of Contents
- [Using The App](#using-the-app)
    - [Create a user](#create-a-user)
    - [Logging In](#logging-in)
- [Users](#users)
	- [Get all users](#get-all-users)
	- [Get a single user](#get-a-single-user)
	- [Get messages that are sent to a user](#get-messages-that-are-sent-to-a-user)
	- [Get messages that are sent from a user](#get-messages-that-are-sent-from-a-user)
- [Messages](#messages)
	- [Get a single message](#get-a-single-message)
	- [Create a new message](#create-a-new-message)
	- [Mark a message as read](#mark-a-message-as-read)

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
```

## Users

### Get all users
To get all users, send a `GET` request to:
```console
$ curl http://localhost:3000/users/
```

*Note: you must be logged in to get all users.*

### Get a single user
To get a specific user, send a `GET` request with the user's `username` in the URL to the following endpoint:
```console
$ curl http://localhost:3000/users/[username]
```
*Note: you must be logged in to get a specific user.*

### Get messages that are sent to a user
You can get all messages that are sent to a specific user.
To do this, send a `GET` request with the user's `username` in the URL to the following endpoint:
```console
$ curl http://localhost:3000/users/[username]/to
```

*Note: in order to get 'To' messages, you must be logged in as either the sender or recipient of the message.*


### Get messages that are sent from a user
You can get all messages that are sent from a specific user.
To do this, send a `GET` request with the user's `username` in the URL to the following endpoint:
```console
$ curl http://localhost:3000/users/[username]/from
```

*Note: in order to get 'From' messages, you must be logged in as either the sender or recipient of the message.*

## Messages

### Get a single message
To retrieve a single message, send a `GET` request with the Message's `id` in the URL to the following endpoint:
```console
$ curl http://localhost:3000/messages/[id]
```

*Note: in order to get a message, you must be logged in as either the sender or recipient of the message.*

### Create a new message
To create a new message, send a `POST` request to the following endpoint:
```console
$ curl http://localhost:3000/messages -X POST
```

with the following body:
```json
{
	"token": "[token]",
	"from_username": "[from_username]",
	"to_username": "[to_username]",
	"body": "[body of message]"
}
```

*Note: in order to create a message, you must be logged in.*

### Mark a message as read

To mark a message as read, send a `POST` request with the Message `id` to the following endpoint:
```console
$ curl http://localhost:3000/messages/[id]/read -X POST
```

*Note: in order to mark a message as read, you must be logged in as the recipient of the message.*
