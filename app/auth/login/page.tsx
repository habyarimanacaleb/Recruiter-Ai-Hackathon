import LoginFormUI from "@/components/common/LoginForm"; 

export default function LoginPage() {

  return (
    <div className="relative flex items-center justify-center min-h-[80vh]">
      {/* Background Glow to match Register page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10" />
      <LoginFormUI />
    </div>
  );
}
