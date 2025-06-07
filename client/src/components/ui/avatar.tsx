import Image from "next/image";
export default function Avatar({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  return (
    <div
      className={`h-[${size}px] w-[${size}px] relative rounded-full overflow-hidden`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={size.toString() + "px"}
      />
    </div>
  );
}
