import type { ProductsResponse } from "@/types/product";
import type { PostsResponse } from "@/types/post";
import {
  getPublicBestSellersPage,
  getPublicProductsPage,
  getPublicRootCategories,
} from "@/features/products/api/get-public-page-data";
import { getPublicPostsPage } from "@/features/posts/api/get-public-posts-page";

import Banner from "./_components/banner";
import PostList from "./_components/post-list";
import PromoBanners from "./_components/promo-banners";
import PartnerLogos from "./_components/partner-logos";
import BestSellerList from "./_components/best-seller-list";
import CategoryProductLists from "./_components/category-product-lists";

export const revalidate = 60;

const HomePage = async () => {
  const [bestSellers, categories, posts] = await Promise.all([
    getPublicBestSellersPage({ limit: 12 }).catch(() => null),
    getPublicRootCategories().catch((): undefined => undefined),
    getPublicPostsPage({ page: 1, limit: 18, sortBy: "newest" }).catch(
      (): PostsResponse | null => null,
    ),
  ]);
  const visibleCategories = (categories ?? []).slice(0, 4);
  const categoryEntries = await Promise.all(
    visibleCategories.map(async (category) =>
      getPublicProductsPage({
        page: 1,
        limit: 12,
        categoryId: category.id,
      })
        .then((page) => [category.id, page] as const)
        .catch(
          (): readonly [string, ProductsResponse | null] => [category.id, null],
        ),
    ),
  );
  const categoryProducts = Object.fromEntries(
    categoryEntries.filter(
      (entry): entry is readonly [string, ProductsResponse] => !!entry[1],
    ),
  );

  return (
    <main>
      <Banner />
      <BestSellerList
        seeMoreHref="/products/best-sellers"
        initialPage={bestSellers ?? undefined}
      />
      <PromoBanners />
      <CategoryProductLists
        maxCategories={4}
        initialCategories={categories}
        initialProducts={categoryProducts}
      />
      <PartnerLogos />
      <PostList seeMoreHref="/posts" initialPage={posts ?? undefined} />
    </main>
  );
};

export default HomePage;
