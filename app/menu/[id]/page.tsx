import MenuItemDetails from "@/components/menu/menu-item-details"

type MenuItemRouteProps = {
  params: Promise<{ id: string }>
}

export default async function MenuItemRoute({ params }: MenuItemRouteProps) {
  const { id } = await params
  return <MenuItemDetails itemId={id} />
}
