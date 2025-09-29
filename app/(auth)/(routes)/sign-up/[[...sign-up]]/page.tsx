import { SignUp } from "@clerk/nextjs";

/**
 * User registration page.
 *
 * Renders Clerk's sign-up form for new user account creation.
 */
export default function Page() {
  return <SignUp />;
}
