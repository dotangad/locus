import { PrismaClient, TaskType } from "@prisma/client";
import { add } from "date-fns";
import faker from "faker";
import bcrypt from "bcrypt";
const db = new PrismaClient();

async function seedUsers(n: number) {
  const password = await bcrypt.hash("password", 10);
  return Promise.all([
    db.user.create({
      data: {
        schoolName: "Admin Account",
        email: "locus@exun.co",
        password,
        admin: true,
      },
    }),
    db.user.createMany({
      data: Array(n - 1)
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
  ]);
}

async function seedTasks() {
  return db.task.createMany({
    data: Array(100)
      .fill("-")
      .map(() => {
        const type = (
          Math.random() > 0.5
            ? "DIRECT"
            : Math.random() > 0.5
            ? "GROUP"
            : "SUBMISSION"
        ) as TaskType;
        const groupQuestions =
          type == "GROUP" ? Math.floor((Math.random() * 10) % 5) + 1 : null;

        return {
          type,
          points: 1000,
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
          groupQuestions,
          retry: type == "DIRECT" ? Math.random() > 0.5 : null,
          answer:
            type == "GROUP"
              ? JSON.stringify(
                  Array(groupQuestions)
                    .fill(1)
                    .map(() => "answer123123")
                )
              : type == "SUBMISSION"
              ? null
              : "answer123123",
        };
      }),
  });
}

async function seed() {
  await Promise.all([seedUsers(100), seedTasks()]);
}

seed();
