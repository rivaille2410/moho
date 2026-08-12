import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  return (
    <div className="relative hidden lg:block">
      <Input placeholder="Tìm kiếm sản phẩm..." className="min-w-md h-10" />
      <Button size={"xl"} className="absolute right-0 min-w-12 rounded-l-none">
        <Search />
      </Button>
    </div>
  );
};
