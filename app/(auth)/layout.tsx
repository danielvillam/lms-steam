/**
 * Authentication layout component.
 *
 * Provides a centered layout for authentication-related pages.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="h-full flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
