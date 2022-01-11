import { User } from "@prisma/client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useTransition,
} from "remix";
import bcrypt from "bcrypt";
import { generateSlug } from "random-words";
import Layout from "~/components/Layout";
import { ensureAdmin } from "~/utils/session.server";
import TextInput from "~/components/TextInput";
import { useState } from "react";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";

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

  const user = await db.user.create({
    data: {
      schoolName: schoolName as string,
      email: email as string,
      password: await bcrypt.hash(password, 10),
    },
  });

  return redirect(`/admin/users/${user.id}`);
};

export default function () {
  const generatePassword = (n = 3) => {
    return generateSlug(n, {
      partsOfSpeech: ["adjective", "adjective", "noun"],
    });
  };

  const { user } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const transition = useTransition();
  const actionData = useActionData<ActionData | undefined>();
  const [password, setPassword] = useState<string>(generatePassword(3));

  return (
    <Layout user={user}>
      <div className="px-5 mx-auto max-w-screen-sm">
        <div className="my-8 flex items-center gap-x-3 bg-white rounded p-6">
          <div
            className="rounded-xl flex items-center justify-center p-3 bg-gray-100 cursor-pointer shadow-md"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
          </div>
          <div>
            <div className="text-exun font-bold text-xl">Create User</div>
            <div className="text-gray-500 text-md">
              Submitting this form will create a new user account. Please copy
              the password.
            </div>
          </div>
        </div>

        <div className="my-8">
          <Form method="post" className="max-w-[400px] mx-auto">
            <TextInput
              id="schoolName"
              name="schoolName"
              label="school name"
              type="schoolName"
              placeholder="Lorem Ipsum School"
              containerClassName="my-5 min-w-[300px]"
              disabled={transition.state === "submitting"}
              error={actionData?.fieldErrors?.schoolName}
              defaultValue={actionData?.fields?.schoolName}
              aria-invalid={Boolean(actionData?.fieldErrors?.schoolName)}
            />
            <TextInput
              id="email"
              name="email"
              label="email"
              type="email"
              placeholder="school@school.com"
              containerClassName="my-5 min-w-[300px]"
              disabled={transition.state === "submitting"}
              error={actionData?.fieldErrors?.email}
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            />
            <div className="my-5 min-w-[300px]">
              <label className="text-xs font-bold uppercase mb-3 transition text-gray-400">
                Password
              </label>
              <input type="hidden" name="password" value={password} />
              <div className="flex items-center text-gray-500">
                <div className="flex-1">{password}</div>
                <button
                  className="text-exun bg-white rounded shadow-sm hover:shadow-lg transition p-2"
                  onClick={() =>
                    setPassword(
                      generatePassword(((Math.random() * 10) % 3) + 2)
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
              <div className="w-full flex justify-center mt-8">
                <Button
                  type="submit"
                  disabled={transition.state === "submitting"}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
