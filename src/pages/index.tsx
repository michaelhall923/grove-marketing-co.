import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';

export default function Home() {
  return (
    <div>
      <SEO title="Grove Marketing Co. | Digital Marketing, Web Development & SEO" />
      <HeaderFix />
      <main />
    </div>
  );
}
