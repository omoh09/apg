import { getProductBySlug } from "@calls/productCalls";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import StarRating from "@/components/ui/starRating";
import bg from "@/public/icons/contourBg.png";
import { HiBadgeCheck } from "react-icons/hi";
import Link from "next/link";
import AddToCart from "./addToCart";

type ProductImage = {
  id: number;
  url: string;
  alt?: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);

    if (!product?.data) {
      return { title: "Product Not Found | Articulate Plugs and Gadgets" };
    }

    return {
      title: `${product.data.title} | Articulate Plugs and Gadgets`,
      description: product.data.short_description,
    };
  } catch {
    return { title: "Product Not Found | Articulate Plugs and Gadgets" };
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let res;
  try {
    res = await getProductBySlug(slug);
  } catch {
    return notFound();
  }

  const product = res?.data;
  if (!product) return notFound();

  const {
    id,
    title,
    short_description,
    detailed_description,
    cover_photo,
    gallery,
    price,
    currency,
    rating_average,
    rating_count,
    general_specifications,
    laptop_specifications,
    phone_specifications,
    accessory_specifications,
    rating_breakdown,
  } = product;

  const allSpecs = {
    ...general_specifications,
    ...laptop_specifications,
    ...phone_specifications,
    ...accessory_specifications,
  };

  const currencySymbols = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  return (
    <section className="container mx-auto space-y-10 pb-20 text-[#121417]">
      {/* --- Name Banner --- */}
      <div className="relative rounded-2xl h-[200px] w-full overflow-hidden">
        <Image
          src={bg}
          alt="spiral"
          fill
          className="object-cover z-10"
          priority
        />
        <div className="inset-0 w-full h-full absolute z-20 bg-primary mix-blend-plus-lighter rounded-2xl">
          <div className=" text-black flex items-center px-20 h-full w-full">
            <h1 className="text-4xl font-bold tracking-tighter">{title}</h1>
          </div>
        </div>
      </div>
      <AddToCart title={title} id={id} />
      {/* --- Main Product Layout --- */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Large Image */}
        <div className="rounded-xl overflow-hidden bg-[#EFEFEF] ">
          <div className="relative w-full h-[400px] py-3">
            <Image
              src={cover_photo?.url}
              alt={cover_photo?.alt || title}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right: Gallery */}
        <div className="grid grid-cols-2 gap-4">
          {gallery?.map((img: ProductImage) => (
            <div
              key={img.id}
              className="relative h-full w-full bg-[#EFEFEF] rounded-lg "
            >
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Price and Short Description  --- */}
      <div>
        <h4 className="text-4xl tracking-tighter font-bold">
          {currencySymbols[currency as keyof typeof currencySymbols] ||
            currency}{" "}
          {price}
        </h4>
        <p className="text-2xl tracking-tighter font-medium">
          {short_description}
        </p>
      </div>

      {/* --- Feature Icons --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mr-28">
        <div className="p-5 bg-[#fafafa] rounded-3xl  flex flex-col items-start tracking-tighter">
          <span>
            <HiBadgeCheck size={48} className="text-primary" />
          </span>
          <span className="font-medium text-2xl mt-4 ">
            Affordable Shipping
          </span>
          <span>You will love at great low prices</span>
        </div>
        <div className="p-5 bg-[#fafafa] rounded-3xl  flex flex-col items-start tracking-tighter">
          <span>
            <HiBadgeCheck size={48} className="text-primary" />
          </span>
          <span className="font-medium text-2xl mt-4 ">Flexible Payment</span>
          <span>Pay via Multiple channels</span>
        </div>
        <div className="p-5 bg-[#fafafa] rounded-3xl  flex flex-col items-start tracking-tighter">
          <span>
            <HiBadgeCheck size={48} className="text-primary" />
          </span>
          <span className="font-medium text-2xl mt-4 ">Fast Delivery</span>
          <span>Experience the joy of fast shipping</span>
        </div>
        <div className="p-5 bg-[#fafafa] rounded-3xl  flex flex-col items-start tracking-tighter">
          <span>
            <HiBadgeCheck size={48} className="text-primary" />
          </span>
          <span className="font-medium text-2xl mt-4 ">Premium Support</span>
          <span>Outstanding premium support</span>
        </div>
      </div>

      {/* --- Specifications --- */}
      <div>
        <h3 className="text-2xl tracking-tighter font-bold mb-4">
          Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-gray-700 ">
          {Object.entries(allSpecs).map(([key, value]) => (
            <div className="flex flex-col gap-1" key={key}>
              <span className="text-[#61758A] capitalize">
                {key.replaceAll("_", " ")}:
              </span>
              <span className="text-[#121417] ">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Detailed Description --- */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Detailed Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {detailed_description?.features}
        </p>
      </div>

      {/* --- Ratings --- */}
      <div>
        <h3 className="text-2xl font-bold mb-3">Reviews</h3>
        <div className="flex gap-5">
          <div className="space-y-2 flex flex-col mb-4">
            <span className="text-3xl font-extrabold">
              {parseFloat(rating_average).toFixed(1)}
            </span>
            <StarRating rating={parseFloat(rating_average).toFixed(1)} />

            <p className="">
              {rating_count}
              <br /> reviews
            </p>
          </div>

          {/* Rating bars */}
          <div className="space-y-2 w-96">
            {rating_breakdown?.map((count: number, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 text-sm">{5 - index}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-[#121417] rounded"
                    style={{
                      width: `${(count / rating_count) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm ">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/products"
        rel="noopener noreferrer"
        className="lg:mt-[56px] mt-10 w-40 lg:w-[250px] btn pryBtn btnBig"
      >
        Back to Categories
      </Link>

      {/* --- Related Products --- */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Related Products</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Coming soon...
          </div>
        </div>
      </div>
    </section>
  );
}
