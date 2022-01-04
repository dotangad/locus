import { PrismaClient, TaskType } from "@prisma/client";
import { add } from "date-fns";
import faker from "faker";
import bcrypt from "bcrypt";
const db = new PrismaClient();

async function seed() {
  const password = await bcrypt.hash("password", 10);
  await Promise.all([
    db.user.create({
      data: {
        schoolName: "Admin Account",
        email: "locus@exun.co",
        password,
        admin: true,
      },
    }),
    db.user.createMany({
      data: Array(100)
        .fill("-")
        .map(() => {
          const firstName = faker.name.firstName();
          const lastName = faker.name.lastName();
          return {
            schoolName: firstName + " " + lastName,
            email: faker.internet.email(firstName, lastName),
            password,
          };
        }),
    }),
    db.task.createMany({
      data: Array(100)
        .fill("-")
        .map(() => ({
          type: (Math.random() > 0.5 ? "DIRECT" : "SUBMISSION") as TaskType,
          points: 1000,
          showPoints: Math.random() > 0.5,
          showTask: Math.random() > 0.5,
          title: faker.company.catchPhrase(),
          tags: JSON.stringify([
            "hello",
            "tag",
            faker.company.bsNoun(),
            faker.company.bsNoun(),
          ]),
          description: faker.lorem.paragraphs(3),
          taskDeadline:
            Math.random() > 0.5 ? null : add(new Date(), { days: 5 }),
          timeDecay: Math.floor(Math.random() * 10),
          answer: "answer123123",
        })),
    }),
  ]);
}

seed();
