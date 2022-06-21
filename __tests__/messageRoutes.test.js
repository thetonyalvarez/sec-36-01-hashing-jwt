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

    await Message.create({from_username: u2.username, to_username: u1.username, body: 'u2-to-u1 A'})
    await Message.create({from_username: u2.username, to_username: u1.username, body: 'u2-to-u1 B'})

	testToken = jwt.sign({ username: "test1" }, SECRET_KEY);

});

describe("Message Routes Test", function () {

	/** GET /id */

	describe("GET /id", function () {
		test("Get a single message", async function () {
			let response = await request(app)
				.get("/messages/1")
				.send({ _token: testToken });

            expect(response.body.message.body).toEqual('u2-to-u1 A');
        });
		test("can't find message", async function () {
            await db.query(`DELETE FROM messages;`)
            try {
                await request(app)
                    .get("/messages/1")
                    .send({ _token: testToken });
    
            } catch (err) {
                expect(err).toEqual(err)
            }
                
        });
    });

	/** POST / message */

	describe("POST /", function () {
		test("Post a single message", async function () {
			let response = await request(app)
				.post("/messages")
				.send({ 
                    _token: testToken,
                    to_username: u2.username,
                    body: 'test to u1'
                });

            expect(response.body.message.body).toEqual('test to u1');
        });
		test("Can't post single message with body", async function () {
            try {
                await request(app)
                    .post("/messages")
                    .send({ 
                        _token: testToken,
                        to_username: u2.username
                    });
            } catch (err) {
                expect(err).toEqual(err)
            }
        });
    });

    /** POST /id/read */

	describe("POST /id/read", function () {
		test("Mark a message as read", async function () {
			let response = await request(app)
				.post("/messages/1/read")

            expect(response.body.message.read_at).toEqual(expect.any(String))
        });
		test("Can't mark read for non-existent message", async function () {
            try {
                await request(app)
                    .post("/messages/1878/read")
            } catch (err) {
                expect(err).toEqual(err)
            }

        });
    });
});

afterAll(async function () {
	await db.end();
});
