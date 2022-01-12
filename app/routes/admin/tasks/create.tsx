import { User } from "@prisma/client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import bcrypt from "bcryptjs";
import Layout from "~/components/Layout";
import { ensureAdmin } from "~/utils/session.server";
import { useState } from "react";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";
import Header from "~/components/admin/tasks/create/Header";
import {
  Open,
  Points,
  Retry,
  Tags,
  TaskType,
  Title,
} from "~/components/admin/tasks/create/Fields";

type LoaderData = { user: User };
export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureAdmin(request, "/");
  return { user };
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    schoolName: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string | undefined;
    schoolName: string | undefined;
    password: string | undefined;
  };
};
export const action: ActionFunction = async ({ request }) => {
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const { email, schoolName, password } = Object.fromEntries(
    await request.formData()
  );

  if (!schoolName || schoolName == "")
    return {
      fields: { email, schoolName, password },
      fieldErrors: { schoolName: "School name can not be empty" },
    };

  if (!email || schoolName == "" || !validateEmail(email as string))
    return {
      fields: { email, schoolName, password },
      fieldErrors: { email: "Please enter a valid email" },
    };

  const check = await db.user.findUnique({ where: { email: email as string } });
  if (check) return { formError: "An account with that email already exists" };

  const user = await db.user.create({
    data: {
      schoolName: schoolName as string,
      email: email as string,
      password: await bcrypt.hash(password as string, 10),
    },
  });

  return redirect(`/admin/users/${user.id}`);
};

export default function () {
  const { user } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const actionData = useActionData<ActionData | undefined>();
  const [title, setTitle] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [type, setType] = useState<string>("DIRECT");
  const [tags, setTags] = useState<string[]>([]);
  const [retry, setRetry] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Layout user={user}>
      <div className="px-5 mx-auto max-w-screen-xl">
        <Header />

        <div className="my-8 grid grid-cols-3 gap-x-10">
          <Form method="post" action="/admin/users/create" className="w-full">
            <Title {...{ title, setTitle, actionData, transition }} />
            <Points {...{ points, setPoints, actionData, transition }} />
            <TaskType {...{ type, setType, actionData, transition }} />
            <Retry {...{ retry, setRetry, actionData, transition }} />
            <Open {...{ open, setOpen, actionData, transition }} />
            <Tags {...{ tags, setTags, actionData, transition }} />

            <div className="my-5 min-w-[300px]">
              <div className="w-full flex justify-center">
                <Button
                  type="submit"
                  disabled={transition.state === "submitting"}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
          <div className="col-span-2">
            <div className="text-2xl font-bold text-gray-700 sm:text-4xl">
              {title}
            </div>
            <div className="flex mt-1 text-sm font-bold text-gray-500 uppercase gap-x-2">
              <span>{points} points</span>
              <span className="font-extrabold">&middot;</span>
              <span>{type}</span>
              <span className="font-extrabold">&middot;</span>
              <span>{tags.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
