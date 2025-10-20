import React from "react";
import Image from 'next/image'
import Link from 'next/link'
import ReactPlayer from "react-player";
import { SourceProps } from "react-player/base";
import { Rings } from "react-loader-spinner";
import { Button } from "@mui/material";


interface Props {

	content?: any,

}

const ContentLayout: React.FC<Props> = ({ content }) => {

	const [loader, setLoader] = React.useState(true)
	const [cookieConsent, setCookieConsent] = React.useState(false)


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

	const contentToArray = () => {
		if (content && content?.acf?.contents)
			return Object.keys(content?.acf?.contents)
				.map(function (key) {
					return content.acf.contents[key];
				})
		else { return [] }
	}

	const lay = contentToArray()

	

	const consentWindow = () => {
		return <div
			className="post-img-container"
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center", 
				gap: "20px"
			}}>
			<div className="bg-blure"></div>
			<Image
				alt="img"
				placeholder="blur"
				blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
				src={content?.acf?.anteprima} className="gallery-img" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
			<div style={{
				textAlign: "center",
				padding: "10px",
				zIndex: "2",
				position: "absolute",
				display: "flex",
				flexDirection: "column",
				gap: "20px" 
			}}>
				<p>This content is hosted by Youtube.com. By showing the external content you accept the <a style={{ textDecoration: "underline" }} href="https://www.youtube.com/t/terms">term and condition</a> of Youtube.com </p>
				<Button className="open-model-btn" onClick={() => { localStorage.setItem('ytmy', "true"); setCookieConsent(true) }}>Show video</Button>
				{/* <p>Your choice will be saved in a cookie managed by paolominopoli.com untile you have closed your browser</p> */}
			</div>

		</div>
	}

	const contentRender = (obj: any, i: number) => {
		if (obj && obj.type && obj.type == "image")
			return <div className="post-img-container" key={i} >
				
				<Image
				alt="img"
				placeholder="blur"
				blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
				src={obj.url} className="gallery-img" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
				{obj.description && <p className='post-content-description'>{obj.description}</p>}</div>
		if (obj && obj.type && obj.type == "video")
			return <div key={"video" + i} className="player-wrapper">
				{loader && <Rings wrapperClass="loader video_loader" color="#008069" ariaLabel="loading-indicator" />}
				<ReactPlayer
					className='react-player'
					muted
					disableRemotePlayback
					width='100%'
					height='100%'
					url={obj.url}
					playsinline
					playing
					loop
					onReady={() => setLoader(false)}
				/>

				{obj.description && <p className='post-content-description'>{obj.description}</p>}</div>
		else
			return obj && <div key={i} className='post-content-container' dangerouslySetInnerHTML={{ __html: obj }} />
	}

	const renderVideo = (url: string | string[] | SourceProps[] | MediaStream | undefined) => {
		return cookieConsent ? <div className="player-wrapper">
			{loader && <Rings wrapperClass="loader video_loader" color="#008069" ariaLabel="loading-indicator" />}
			<ReactPlayer
				className='react-player'
				muted
				width='100%'
				height='100%'
				url={url}
				playsinline
				playing
				loop
				onReady={() => setLoader(false)}
			/>
		</div>
			: consentWindow()
	}

	React.useEffect(() => {

		if (localStorage.getItem('ytmy')) {
			const res: any = localStorage.getItem('ytmy');
			if (res === "true")
				setCookieConsent(true);
		}

	}, []);


	return (
		<>
			{lay.map((obj, i) =>
				contentRender(obj, i)
			)}
			{content?.acf?.videotop && renderVideo(content?.acf?.videotop)}
			{content?.acf?.videotop2 && renderVideo(content?.acf?.videotop2)}
			{content?.acf?.videotop3 && renderVideo(content?.acf?.videotop3)}
			{content?.acf?.videotop4 && renderVideo(content?.acf?.videotop4)}
			{content?.acf?.galleria &&
				content?.acf?.galleria.map((el: any, i: number) =>
					contentRender(el, i)
					// <div key={el.id} className="post-img-container" >
					// 	<Image blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`} src={el.url} className="gallery-img" layout="fill" placeholder="blur" />
					// 	{el.description && <p className='post-content-description'>{el.description}</p>}
					// </div>
				)}
			{content?.acf?.videobottom && renderVideo(content?.acf?.videobottom)}
			{content?.acf?.videobottom2 && renderVideo(content?.acf?.videobottom2)}
			{content?.acf?.videobottom3 && renderVideo(content?.acf?.videobottom3)}
			{content?.acf?.videobottom4 && renderVideo(content?.acf?.videobottom4)}
		</>
	);
}

export default ContentLayout;