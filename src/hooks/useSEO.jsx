// hooks/useSEO.js
import Head from 'next/head';

export default function useSEO({ title, description, image, price, availability }) {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {price && <meta property="product:price:amount" content={price.toFixed(2)} />}
      {availability && <meta property="product:availability" content={availability} />}
    </Head>
  );
}
