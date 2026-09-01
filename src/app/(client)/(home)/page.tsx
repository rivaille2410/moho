import Banner from "./_components/banner";
import PostList from "./_components/post-list";
import ProductList from "./_components/product-list";
import BestSellerList from "./_components/best-seller-list";

const HomePage = () => {
  return (
    <main>
      <Banner />
      <BestSellerList seeMoreHref="/products/best-sellers" />
      <ProductList seeMoreHref="/products" />
      <PostList seeMoreHref="/posts" />
    </main>
  );
};

export default HomePage;
