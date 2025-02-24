import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";

const useLocomotiveScroll = () => {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]") as HTMLElement,
      smooth: true,
    });
    return () => {
      scroll.destroy();
    };
  }, []);
};

export default useLocomotiveScroll;
