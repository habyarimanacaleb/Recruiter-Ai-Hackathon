import { Button } from "@base-ui/react";
import Image from "next/image";

function SocialMediaAuth() {
  return (
    <>
      {/*Social-media Auth*/}
      <section className="flex items-center justify-center py-4">
        <span className="w-full mx-3 h-0.5 rounded-full bg-gray-200"></span>
        <span className="font-bold text-gray-500">OR</span>
        <span className="w-full mx-3 h-0.5 rounded-full bg-gray-200"></span>
      </section>
      <section aria-disabled="true" className="mb-4">
        <Button
          className="flex justify-center items-center gap-4 w-full h-11 text-base text-blue-600 border border-gray-400 rounded-xl font-medium transition-all hover:shadow-lg active:scale-[0.85]"
          type="button"
        >
          <Image src={"/google.svg"} alt="Google icon" width={21} height={21} />
          <span>Sign In with Google</span>
        </Button>
      </section>
    </>
  );
}

export default SocialMediaAuth;
