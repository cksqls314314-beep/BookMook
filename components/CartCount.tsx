"use client";

import { useEffect, useState } from "react";
import { getCart, getCount } from "@/lib/cart";

/** 헤더에서 사용: <Link href="/cart">장바구니 (<CartCount />)</Link> */
export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const list = getCart();
    setCount(getCount(list));

    const update = () => {
      const list = getCart();
      setCount(getCount(list));
    };
    window.addEventListener("cart:changed", update as any);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart:changed", update as any);
      window.removeEventListener("storage", update);
    };
  }, []);

  return <>{count}</>;
}
