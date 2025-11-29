import { LoginCard } from '@/components/auth/login-card';

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="animated-background" />
      <div className="z-10 px-4">
        <LoginCard />
      </div>
    </div>
  );
}
