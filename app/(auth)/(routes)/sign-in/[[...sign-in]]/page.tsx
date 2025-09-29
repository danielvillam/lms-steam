import { SignIn } from "@clerk/nextjs";

/**
 * Sign-in page.
 *
 * Uses Clerk's `SignIn` component to handle user authentication.
 */
export default function Page() {
    return <SignIn />;
}
