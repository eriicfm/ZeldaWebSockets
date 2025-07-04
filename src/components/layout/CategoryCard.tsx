import Link from "next/link";

export const CategoryCard = ({
  href,
  title,
  description,
  bgImage,
  disabled = false,
}: {
  href: string;
  title: string;
  description: string;
  bgImage: string;
  disabled?: boolean;
}) => {
  const content = (
    <div
      className={`relative p-6 rounded-xl shadow-md overflow-hidden h-64 flex flex-col justify-end transition-all duration-300 group
        ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow-xl hover:scale-[1.02]"
        }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,83,46,0.3), rgba(0,83,46,0.9)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay triforce pattern */}
      <div className="absolute inset-0 bg-[url('/img/triforce_pattern.png')] bg-repeat opacity-5 group-hover:opacity-10 transition-opacity"></div>

      <h2 className="text-2xl font-semibold mb-2 text-yellow-400 relative z-10">
        {title}{" "}
        {!disabled ? (
          <span>&rarr;</span>
        ) : (
          <span className="text-sm">(Coming Soon)</span>
        )}
      </h2>
      <p className="text-green-50 relative z-10">{description}</p>
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
};

export default CategoryCard;
