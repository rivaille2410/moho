import Banner from "./_components/banner";
import ProductList from "./_components/product-list";
import BestSellerList from "./_components/best-seller-list";

const HomePage = () => {
  return (
    <main>
      <Banner />
      <BestSellerList seeMoreHref="/products/best-sellers" />
      <ProductList seeMoreHref="/products" />
    </main>
  );
};

export default HomePage;
