
import { Divider } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { GetStaticPaths, GetStaticPropsResult, NextPage } from 'next'
import { imageOptimizer } from 'next/dist/server/image-optimizer'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Card from '../../components/Card'
import ContentLayout from '../../components/ContentsLayout'
import Swipe3DModel from '../../components/Swipe3DModel'
import { cartSelector, setInfo } from '../../store/cart.slice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

interface Props {

  posts?: any[],
  infos?: any[]

}

const Post: NextPage<Props> = ({ posts, infos }) => {
  const router = useRouter()
  const { id } = router.query

  const { data } = useAppSelector(cartSelector)
  // const [item,setItem] = React.useState(data.find(item => item.id === parseInt(id)))
  const item =
    posts?.find(item => item.id.toString() === id);


  async function navigate() {
    router.push({
      pathname: "/",

    }, undefined, { scroll: false });
  }

  const dispatch = useAppDispatch()


  React.useEffect(() => {
    window.scrollTo(0, 0);
    window.onpopstate = () => {
      navigate()
    };
  }, [])

  useEffect(() => {
    dispatch(setInfo(infos))
  },
    [])

  return<>
  <div className="root">

    <motion.div key={item?.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0}}  transition={{ velocity: 50 }} className="post-container">
      <div className="hero-post">
        <div className="card-content-container"  >
          <div className="card-content post-content">
            <div className="card-image-container" >
              <Image layout='fill'
                className="card-image" src={item?.acf?.anteprima ? item?.acf?.anteprima : "/"} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "30px" }}>
        <h1>{item?.title.rendered}</h1>
      </div>
      {item?.acf?.embed && <Swipe3DModel embed={item.acf.embed}></Swipe3DModel>}
      <div className='post-content-container' dangerouslySetInnerHTML={{ __html: item?.content.rendered }} />
      {/* {item?.acf?.galleria && item?.acf?.galleria?.map((el: string | undefined, i: any) =>
        <Image key={i} src={el} alt="" style={{ width: "100%", height: "auto" }} />)} */}
      <ContentLayout content={item} />
      <div className='all-work-container'>
     
      <h2>All Workss</h2>
      <div className='divider'></div>
       <ul className="card-list">
       {posts?.map(item => (
         <Card key={item.id} item={item} scrollTop/>
       ))}
     </ul>
     </div>
    </motion.div>
 
  </div>
  
 </> 
}
export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const infourl =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/informazioni?_embed&per_page=100";

  const url =
    "https://paolominopoli.altervista.org/wp-json/wp/v2/posts?_embed&per_page=100";

  //const result = await Axios.get(url);
  //const menu =  result.data
  const infores = await fetch(infourl, { method: 'GET' });
  const res = await fetch(url, {
    method: 'GET',

    credentials: "same-origin", //include, same-origin
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
  });

  const posts = await res.json();
  const infos = await infores.json()

  //  const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
      infos

    },
    revalidate: 10,
  };
}

export default Post