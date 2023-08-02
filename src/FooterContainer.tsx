import Footer from 'Footer';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollBlock } from 'global/hooks/useBlockScroll';

function FooterContainer(): JSX.Element {
  const location = useLocation();
  const [showFooter, setShowFooter] = React.useState<boolean>(true);
  const [blockScroll, allowScroll] = useScrollBlock();

  React.useEffect(() => {
    const show =
      !location.pathname.toLowerCase().startsWith('/workroom') &&
      !location.pathname.toLowerCase().startsWith('/dispute');
    setShowFooter(show);
    if (show) {
      allowScroll();
    } else {
      blockScroll();
    }
  }, [location]);

  return <React.Fragment>{showFooter && <Footer />}</React.Fragment>;
}

export default FooterContainer;
