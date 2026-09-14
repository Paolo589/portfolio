import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import { motion } from 'framer-motion'
import { category, filterPostsByCategory, posts } from '../../posts/posts'
import CardNew from '../../components/CardNew'

interface Props {
  categoryId: number
}

const CategoryPage: NextPage<Props> = ({ categoryId }) => {
  const filteredPosts = filterPostsByCategory(posts, categoryId)

  React.useEffect(() => {
    window.onpopstate = () => { };
  }, [])

  return (
    <div className="root">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ velocity: 50 }}
        id="card-list-container"
      >
        <ul className="card-list">
          {filteredPosts?.map((item: any) => (
            <CardNew key={item.id} item={item} />
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = category
    .filter((item) => item.id !== 1)
    .map((item) => ({
      params: { slug: item.slug },
    }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const match = category.find((item) => item.slug === params?.slug)

  return {
    props: {
      categoryId: match?.id ?? 1,
    },
  }
}

export default CategoryPage
