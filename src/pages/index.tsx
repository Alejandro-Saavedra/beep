import { SignInButton, useUser } from "@clerk/nextjs";
// import Head from "next/head";
// import Link from "next/link";
// import SignInPage from "~/signIn";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { type NextPage } from "next";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/cardLayout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later!");
      }
    },
  });

  console.log(user);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
        // placeholder="blur"
      />
      <input
        placeholder="Type something"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.userName}'s profile picture`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
        // placeholder="blur"
      />
      <div className="flex flex-col">
        <div className="flex gap-2 font-bold text-slate-300">
          <Link href={`/@${author.userName}`}>
            <span>{`@${author.userName}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`· ${dayjs(
              post.createdAt,
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong 😵</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

// export default function Home() {
const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Starts fetching the data immediately
  api.posts.getAll.useQuery();

  // Will return an empty div if BOTH aren't loaded, since user tends to load faster
  if (!userLoaded) return <div />;

  return (
    <>
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn ? (
            <button className="btn btn-primary">
              <div className="flex justify-center">
                <SignInButton />
              </div>
            </button>
          ) : (
            <div className="flex w-full justify-center">
              <CreatePostWizard />
              {/* //this is the otherway of doing whats above */}
              {/* {!user.isSignedIn && (
                  <div className="flex justify-center">
                  <SignInButton />
                </div>
                )}
                 {user.isSignedIn && <CreatePostWizard />} */}
            </div>
          )}
        </div>
        <Feed />
      </PageLayout>
      {/* <SignInPage /> */}
    </>
  );
};

export default Home;
