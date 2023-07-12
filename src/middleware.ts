import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// export default authMiddleware();
export default authMiddleware(() => {
  console.log("running");

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
