import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

interface NewButtonProps {
  href: string;
  text?: string;
}

export default function NewButton({ href, text }: NewButtonProps) {
  return (
    <Link href={href}>
      <Button
        className="rounded-full"
        variant="outline"
        size={text ? "default" : "icon"}
        aria-label="Add new item"
      >
        <PlusIcon size={16} aria-hidden="true" />
        {text && <span className="ml-2">{text}</span>}
      </Button>
    </Link>
  );
}
