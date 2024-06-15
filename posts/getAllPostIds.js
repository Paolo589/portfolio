import {posts} from './posts'
export function getAllPostIds() {
  

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return posts.map((el) => {
    return {
      params: {
        slug: el.slug,
      },
    };
  });
}