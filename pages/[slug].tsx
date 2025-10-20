

import { motion } from 'framer-motion'
import {  GetStaticProps, } from 'next'

import {getAllPostIds} from '../posts/getAllPostIds'
import {getPostData} from '../posts/getPost'
import Image from 'next/image'
import {posts} from '../posts/posts'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import CardNew from '../components/CardNew'
import ContentsLayoutNew from '../components/ContentsLayoutNew'




interface Props {

postData:any

}
interface Params {
  id: string;
}


const Post: React.FC<Props> = ({ postData }) => {

  const router = useRouter()
  let url = "/"
  const item = postData
   
  const navigate = React.useCallback(async () => {
    router.push({
      pathname: "/",

    }, undefined, { scroll: false });
  }, [router]);

  // riordina i post in base a dove ci troviamo
  const reorderPosts = (posts:any, currentPostId:any) => {
    const currentIndex = posts.findIndex((post:any) => post.id === currentPostId);
    if (currentIndex !== -1) {
      const postsAfter = posts.slice(currentIndex + 1);
      const postsBefore = posts.slice(0, currentIndex + 1);
      return postsAfter.concat(postsBefore);
    }
    return posts;
  };
  const reorderedPosts = reorderPosts(posts, item.id);



  React.useEffect(() => {
    window.scrollTo(0, 0);
    window.onpopstate = () => {
      navigate()
    };
  }, [navigate])



  return <>
  <div className="root">
    <motion.div key={item?.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0}}  transition={{ velocity: 50 }} className="post-container">
      <div className="hero-post">
        <div className="card-content-container"  >
          <div className="card-content post-content">
            <div className="card-image-container" >
              <Image layout='fill'
                className="card-image" src={item.anteprima_img ? url + item.anteprima_img : "/"} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex" ,flexDirection:'column',color:'#fff'}}>
        <h1>{item.title}</h1>
       {item.sottotitolo && <h3 style={{textTransform:"capitalize"}}>{item.sottotitolo}</h3>}
      </div>
      {/* {item?.acf?.embed && <Swipe3DModel embed={item.acf.embed}></Swipe3DModel>} */}
      {/* <div className='post-content-container' dangerouslySetInnerHTML={{ __html: item?.content.rendered }} />
      {item?.acf?.galleria && item?.acf?.galleria?.map((el: string | undefined, i: any) =>
        <Image key={i} src={el} alt="" style={{ width: "100%", height: "auto" }} />)}  */}
   <ContentsLayoutNew content={item.galleria} />
      <div className='all-work-container'>
      <h2>All Works </h2>
      <div className='divider'></div>
      <ul className="card-list">
          {reorderedPosts?.map((item:any) => (
            <CardNew key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </motion.div>
 
  </div>
  
 </> 
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}


export const getStaticProps: GetStaticProps = async ({ params }) => {



  const postData:any = getPostData(params?.slug);
  //  const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
     postData

    },
    revalidate: 10,
  };
}

export default Post