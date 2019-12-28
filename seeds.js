const db = require('./models');
const faker = require('faker');
const statuses = ["available","requested","unavailable"];

for(let i = 0; i < 20; i++){
    db.user.create({
        email: faker.internet.email(),
        password: faker.internet.password()
    });
    db.unit.create({
        userId: faker.random.number({min:1, max:20}),
        name: faker.lorem.word(),
        description: faker.lorem.sentence(
            word_count = 4
        ),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zip: faker.address.zipCode(),
        // owner_id: faker.random.number({min:1, max:20}),
        capacity: faker.random.number({min:1, max:3}),
        tools: faker.random.boolean(),
        climate: faker.random.boolean(),
        status: "available",
    })
}

