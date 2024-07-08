import type {NextPage } from 'next'
import React from 'react'
import {  motion } from 'framer-motion'
import {posts} from '../posts/posts'
import CardNew from '../components/CardNew'


interface Props {

}

const Casa: NextPage<Props> = ({}) => {
 

  React.useEffect(() => {
   window.onpopstate = () => { };
  }, [])
  

  return (
    <div className="root">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ velocity: 50 }} id="card-list-container" >
        <ul className="card-list">
          {posts?.map(item => (
            <CardNew key={item.id} item={item} />
          ))}
        </ul>
      </motion.div>
    </div>

  )
}
// export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
//   // Call an external API endpoint to get posts.
//   // You can use any data fetching library

  

//   const url =
//     "https://www.paolopiez.com/portfolio/wp-json/wp/v2/posts?_embed&per_page=100";
//     const infourl =
//     "https://www.paolopiez.com/portfolio/wp-json/wp/v2/informazioni?_embed&per_page=100";

//   //const result = await Axios.get(url);
//   //const menu =  result.data

//   const res = await fetch(url,{method:'GET'});
//   const infores = await fetch(infourl,{method:'GET'});

//   const post = await res.json();
//   const infos = await infores.json()

//   //  const res = await fetch('https://.../posts')
//   // const posts = await res.json()

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       post,
//       infos

//     },
//     revalidate: 10,
//   };
// }
export default Casa
