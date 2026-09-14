import Link from "next/link"
import { useRouter } from "next/router"
import { category } from "../../posts/posts"

const DEFAULT_CATEGORY_ID = 1

const CategoryNav = (): JSX.Element => {
	const router = useRouter()

	const selectedId = (() => {
		if (router.pathname === "/category/[slug]") {
			const slug = router.query.slug
			const match = category.find((item) => item.slug === slug)
			return match?.id ?? null
		}
		if (router.pathname === "/") {
			return DEFAULT_CATEGORY_ID
		}
		return null
	})()

	return (
		<nav className="category-nav" aria-label="Categories">
			{category.map((item) => {
				const href = item.id === DEFAULT_CATEGORY_ID ? "/" : `/category/${item.slug}`
				const isActive = selectedId === item.id

				return (
					<Link key={item.id} href={href} passHref>
						<span className={`category-nav-item ${isActive ? "active" : ""}`}>
							{item.name}
						</span>
					</Link>
				)
			})}
		</nav>
	)
}

export default CategoryNav
