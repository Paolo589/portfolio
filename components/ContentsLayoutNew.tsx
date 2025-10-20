import React from "react";
import Image from 'next/image'
import ReactPlayer from "react-player";
import { SourceProps } from "react-player/base";
import { Rings } from "react-loader-spinner";
import { Button } from "@mui/material";


interface Props {

	content?: any,

}

const ContentsLayoutNew: React.FC<Props> = ({ content }) => {

	const [loader, setLoader] = React.useState(true)
	const [cookieConsent, setCookieConsent] = React.useState(false)
	let url = "/"

	const galleria = content

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
			: window.btoa(str);

	const renderContent = (galleria: any[]) => {
		return galleria.map(item => {
			console.log(item)
			switch (true) {
				case item.endsWith('.jpg'):
				case item.endsWith('.png'):
				case item.endsWith('.jpeg'):
					return renderImg(url + item);
				case item.endsWith('.mp4'):
					return renderVideo(url + item);
				default:
					return renderText(item);
			}
		});
	};

	const renderImg = (src: string) => {
		return <div className="post-img-container"  >
			<Image
				placeholder="blur"
				blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
				src={src ? src : "/"} 
				alt="Gallery image"
				className="gallery-img" 
				layout="fill" />
		</div>
	};


	const renderVideo = (url: string | string[] | SourceProps[] | MediaStream | undefined) => {
		return <div className="player-wrapper">
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

	}

	const renderText = (text: string) => {
		return `<p>${text}</p>`;
	};

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
			{/* <Image
				placeholder="blur"
				blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
				src={content?.acf?.anteprima} className="gallery-img" layout="fill" /> */}
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



	const renderYtVideo = (url: string | string[] | SourceProps[] | MediaStream | undefined) => {
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
			{galleria.length > 0 && renderContent(galleria)}

		</>
	);
}

export default ContentsLayoutNew;