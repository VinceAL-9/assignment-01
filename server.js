// Import dependencies
import express from "express";
import { faker } from "@faker-js/faker";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors())

// Helper function to generate a fake user
function generateUser() {
  return {
    gender: faker.person.gender(), // "male" | "female"
    name: {
      title: faker.person.prefix(), // e.g. "Mr", "Miss"
      first: faker.person.firstName(),
      last: faker.person.lastName(),
    },
    location: {
      street: {
        number: parseInt(faker.location.buildingNumber()), // RandomUser uses int
        name: faker.location.street(),
      },
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postcode: faker.location.zipCode(),
      coordinates: {
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
      },
      timezone: {
        offset: "+9:30", // faker doesn’t provide this, you can hardcode or create a small pool
        description: "Adelaide, Darwin",
      },
    },
    email: `${faker.person.firstName().toLowerCase()}${faker.person.lastName().toLowerCase()}@${new Date(faker.date.birthdate()).getFullYear()}.example.com`,
    dob: {
      date: faker.date.birthdate().toISOString(),
      age: faker.number.int({ min: 18, max: 90 }),
    },
    phone: faker.phone.number(),
    cell: faker.phone.number(),
    picture: {
      large: faker.image.avatar(),
      medium: faker.image.avatar(),
      thumbnail: faker.image.avatar(),
    }
  };
}


// Root endpoint - return 1 user
app.get("/", (req, res) => {
  const user = generateUser();
  res.json({ results: [user] });
});


app.use(express.static("public"));

// API endpoint - return multiple users
app.get("/api/users", (req, res) => {
  let results = Number(req.query.count) || 1;
  const users = Array.from({ length: results }, () => generateUser());
  res.json({ results: users });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
