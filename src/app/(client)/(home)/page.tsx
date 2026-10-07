import Banner from "./_components/banner";
import PostList from "./_components/post-list";
import PromoBanners from "./_components/promo-banners";
import PartnerLogos from "./_components/partner-logos";
import BestSellerList from "./_components/best-seller-list";
import CategoryProductLists from "./_components/category-product-lists";

const HomePage = () => {
  return (
    <main>
      <Banner />
      <BestSellerList seeMoreHref="/products/best-sellers" />
      <PromoBanners />
      <CategoryProductLists />
      <PartnerLogos />
      <PostList seeMoreHref="/posts" />
    </main>
  );
};

export default HomePage;
