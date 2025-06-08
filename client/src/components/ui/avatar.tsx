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
      style={{ width: size, height: size }}
      className="relative rounded-full overflow-hidden"
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
