
import Link from "next/link";
import Image from "next/image";

export default function CongratulationsPage() {
  return (
    <div className="bg-white w-full min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex w-full lg:w-[45%] xl:w-1/2 h-full lg:min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-16 bg-[#DDEFFC] lg:rounded-[0px_16px_16px_0px] overflow-hidden px-6 py-12">
        <div className="relative w-16 h-16 lg:w-195 lg:h-150">
          <img
            className="absolute top-0 left-0 w-16 h-16 lg:w-195 lg:h-150"
            alt="Logo icon"
            src="/icons/success.svg"
          />
        </div>
        <div className="top-[-200px] lg:top-[-373px] left-[-150px] lg:left-[-257px] absolute w-[600px] lg:w-[850px] h-[350px] lg:h-[496px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
        <div className="bottom-[-200px] lg:bottom-[-92px] right-[-150px] lg:right-[-267px] absolute w-[200px] lg:w-[850px] h-[100px] lg:h-[150px] bg-[#1d92ed99] rounded-[300px/175px] lg:rounded-[425px/248px] blur-[100px]" />
      </aside>

      {/* ------------- Right side ------------- */}
      <div className="flex w-full lg:w-1/2 min-h-screen relative flex-col items-center justify-center gap-8 lg:gap-12 px-6 py-12 lg:px-8 xl:px-12">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-xl p-4 py-6 rounded-sm sm:rounded-xl border-none shadow-none bg-white">
          <div className="text-center relative mb-2">
            <div className="flex items-center justify-center mb-2 sm:mb-10">
              <div className="w-full flex justify-center items-center">
                <Image
                  src="/icons/logo.svg"
                  alt="logo"
                  width={200}
                  height={150}
                />
              </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-6">
              Congratulations !
            </h1>
            <h2 className="text-base text-secondary mb-10 px-5 mx-auto">
              Your account has been created successfully. Log in to explore more.
            </h2>
          </div>
          <div className="w-full flex justify-center items-center">
            <Link href='/login' className="flex w-65 items-center justify-center py-2.5 text-white bg-primary rounded-full">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
