
import RegisterFormUI from "@/components/common/RegisterForm"; 

export default function RegisterPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10" />
       <RegisterFormUI />
    </div>
  );
}
