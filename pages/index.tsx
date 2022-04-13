import type { GetStaticPropsResult, NextPage } from 'next'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { cartSelector, setData } from '../store/cart.slice'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Card from '../components/Card'


interface Props {

  post?: any[],

}

const Casa: NextPage<Props> = ({ post }) => {
  const { data } = useAppSelector(cartSelector)
  console.log(data)

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch(setData(post))

  }, [post])
  return (
    <div className="root">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ velocity: 50 }} id="card-list-container" >

        <ul className="card-list">
          {post?.map(item => (
            <Card key={item.id} item={item} />
          ))}
        </ul>
      </motion.div>
    </div>

  )
}
export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library



  const url =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/posts?_embed&per_page=100";

  //const result = await Axios.get(url);
  //const menu =  result.data

  const res = await fetch(url);

  const post = await res.json();

  //  const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      post,

    },
    revalidate: 1,
  };
}
export default Casa
