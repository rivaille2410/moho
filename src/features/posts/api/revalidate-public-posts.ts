import { revalidateTag } from "next/cache";

export function revalidatePublicPosts() {
  revalidateTag("public-posts", { expire: 0 });
}
