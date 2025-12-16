import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12">
          <LoginForm />
          <RegisterForm />
        </div>
      </main>
    </>
  );
};

export default AuthPage;
