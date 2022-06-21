const request = require("supertest");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");

let testToken;
let u1;
let u2;

beforeEach(async function () {
	await db.query("DELETE FROM messages");
	await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

	u1 = await User.register({
		username: "test1",
		password: "password",
		first_name: "Test1",
		last_name: "Testy1",
		phone: "+14155550000",
	});

	u2 = await User.register({
		username: "test2",
		password: "password",
		first_name: "Test2",
		last_name: "Testy2",
		phone: "+14155550001",
	});

    await Message.create({from_username: u1.username, to_username: u2.username, body: 'u1-to-u2 A'})
    await Message.create({from_username: u2.username, to_username: u1.username, body: 'u2-to-u1 B'})


	testToken = jwt.sign({ username: "test1" }, SECRET_KEY);

});


describe("Users Routes Test", function () {

	/** GET /users */

	describe("GET /users", function () {
		test("Get all users", async function () {
			let response = await request(app)
				.get("/users")
				.send({ _token: testToken });

			expect(response.body).toEqual({
				users: [
					{
						username: "test1",
						first_name: "Test1",
						last_name: "Testy1",
						phone: "+14155550000"
					},
					{
						username: "test2",
						first_name: "Test2",
						last_name: "Testy2",
						phone: "+14155550001"
					}
				]
			});
		});
		test("can't find users", async function () {
			await db.query(`DELETE FROM messages;`)
			await db.query(`DELETE FROM users;`)
			
			try {
				await request(app)
					.get("/users")
					.send({ _token: testToken });

			} catch (err) {
				expect(err).toEqual(err)
			}
		});
	});

	/** GET /users/username */

	describe("GET /users/username", function () {
		test("Get single user", async function () {
			let response = await request(app)
				.get("/users/test1")
				.send({ _token: testToken });

			expect(response.body.user).toEqual(
				expect.objectContaining({
					username: "test1",
				})
			)
		});
		test("can't get invalid user", async function () {
			try {
				await request(app)
					.get("/users/test234234")
					.send({ _token: testToken });

			} catch (err) {
				expect(err).toEqual(err)
			}

		});
	});

	/** GET /users/username/to - get all messages to user */

	describe("GET /users/username/to", function () {
		test("Get messages to single user", async function () {

			let response = await request(app)
				.get("/users/test1/to")
				.send({ _token: testToken });
			
			expect(response.body.messages[0].body).toEqual("u2-to-u1 B")
		})
		test("Can't view another user's to messages", async function () {
			try {
				await request(app)
					.get("/users/test2/to")
					.send({ _token: testToken })
			} catch (err) {
				expect(err).toEqual(err)
			}
		})
	})

	/** GET /users/username/from - get all messages from user */
	
	describe("GET /users/username/from", function () {
		
		test("Get messages from single user", async function () {
			let response = await request(app)
				.get("/users/test1/from")
				.send({ _token: testToken });
		
			expect(response.body.messages[0].body).toEqual("u1-to-u2 A")
		});
		test("Can't view another user's from messages", async function () {
			try {
				await request(app)
					.get("/users/test2/from")
					.send({ _token: testToken }); 
			} catch (err) {
				expect(err).toEqual(err)
			}
		});
	});
});
	
afterAll(async function () {
	await db.end();
});
