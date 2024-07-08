import React from "react";
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Rings } from "react-loader-spinner";
import ReactPlayer from "react-player";



interface Props {

	item?: any,
	scrollTop?: boolean

}


const CardNew: React.FC<Props> = ({ item, scrollTop = true }) => {

	const [neon, setNeon] = React.useState(false)
	const [hover, setHover] = React.useState(false)
	const [loader, setLoader] = React.useState(true)
  let url = "/"

	const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

	const toBase64 = (str: string) =>
		typeof window === 'undefined'
			? Buffer.from(str).toString('base64')
			: window.btoa(str)

	const videoinHover = (item: any) => {
		if (item ) {
			let video = item.anteprima_video
			if (video) return <motion.div
			key='10000000000'
			initial={{ opacity: 0, }} animate={{ opacity: 1 }} exit={{ opacity: 0}}  transition={{ velocity: 50 }}
			className="player-wrapper">
				 {loader && <Rings wrapperClass="loader video_loader" color="#008069" ariaLabel="loading-indicator" />} 
				<ReactPlayer
					
					className='react-player'
					muted
					width='100%'
					height='100%'
					url={url+video}
					playsinline
					playing
					loop
					onReady={() => setLoader(false)}
				/>
			</motion.div>
			else false
		}
		else false

	}

	return (
		<motion.li className={`card`}
			whileHover={{
				scale: 1.02,
				transition: { duration: 0.5 },
			}}
			onHoverStart={e => { setHover(true) }}
			onHoverEnd={e => { setHover(false); setLoader(true) }}
			onTapStart={() => setNeon(true)}
			onTapCancel={() => setNeon(false)}
		>
			<Link href={`/${item?.slug}`} scroll={scrollTop} >
				<a>
					<div
						className="card-content-container">
						<div 
						className={`card-content ${neon ? "neon" : "NOneon"}`}>

						
								{hover && !!videoinHover(item) ?
									videoinHover(item)
									:
									<motion.div 
									key='9'
									initial={{ opacity: 0, }} animate={{ opacity: 1 }} exit={{ opacity: 0}}  transition={{ velocity: 50 }}
									className="card-image-container" >
									<Image
										placeholder="blur"
										blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
										alt="Paolo Minopoli" layout="fill"
										className="card-image" src={item.anteprima_img ? url+item.anteprima_img : "/"} />
										</motion.div>

								}
					
              
						</div>

					</div>

				</a>
			</Link>
		

		</motion.li>
	);
}

export default CardNew;