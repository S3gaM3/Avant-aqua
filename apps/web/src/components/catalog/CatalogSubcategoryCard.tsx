import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { catalogCategoryDisplayName } from "@/lib/catalog-category-display";
import { categoryIconName } from "@/lib/catalog-category-icon";
import type { CatalogTreeNode } from "@/components/catalog/catalog-types";
type Props = {
  node: CatalogTreeNode;
  variant?: "default" | "direction";
};

function CategoryCardMedia({
  node,
  label,
  iconSize,
  imageWidth,
  imageHeight,
  imageSizes,
  placeholderClassName,
}: {
  node: CatalogTreeNode;
  label: string;
  iconSize: number;
  imageWidth: number;
  imageHeight: number;
  imageSizes: string;
  placeholderClassName: string;
}) {
  if (node.coverPath) {
    return (
      <Image
        src={node.coverPath}
        alt=""
        width={imageWidth}
        height={imageHeight}
        sizes={imageSizes}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        loading="lazy"
      />
    );
  }

  return (
    <span className={placeholderClassName} aria-hidden>
      <Icon name={categoryIconName(label, node.slug)} size={iconSize} strokeWidth={1.5} />
    </span>
  );
}
export function CatalogSubcategoryCard({ node, variant = "default" }: Props) {
  const label = catalogCategoryDisplayName(node.name);
  const href = `/catalog/${node.slug}`;

  if (variant === "direction") {
    return (
      <Link href={href} className="catalog-direction-card">
        <span className="catalog-direction-card__media" aria-hidden>
          <CategoryCardMedia
            node={node}
            label={label}
            iconSize={56}
            imageWidth={320}
            imageHeight={200}
            imageSizes="(max-width: 768px) 50vw, 200px"
            placeholderClassName="catalog-direction-card__placeholder"
          />
        </span>
        <span className="catalog-direction-card__body">
          <span className="catalog-direction-card__title">{label}</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className="catalog-subcard">
      <span className="catalog-subcard__media" aria-hidden>
        <CategoryCardMedia
          node={node}
          label={label}
          iconSize={28}
          imageWidth={88}
          imageHeight={64}
          imageSizes="88px"
          placeholderClassName="catalog-subcard__placeholder"
        />
      </span>
      <span className="catalog-subcard__title">{label}</span>
    </Link>
  );
}
