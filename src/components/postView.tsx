import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="gap-3 border-b border-slate-400 p-4">
      <div className="flex items-center gap-4">
        {" "}
        {/* This is the new flex container */}
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
    </div>
  );
};
