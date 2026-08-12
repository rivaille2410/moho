import { Header } from "./_components/header";
import { NavMenu } from "./_components/nav-menu";
import { MarqueeBar } from "./_components/marquee-bar";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[200vh]">
      <MarqueeBar text="Miễn phí vận chuyển cho đơn hàng từ 500.000đ — Ưu đãi đến hết tháng này!" />
      <Header />
      <NavMenu />
      {children}
    </div>
  );
};

export default ClientLayout;
