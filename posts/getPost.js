import {posts} from './posts'
export function getPostData(slug) {
  const post = posts.find(el => el.slug === slug)
  return post
}
