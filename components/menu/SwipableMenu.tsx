import React from "react";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { GetStaticPropsResult } from "next";
import InfoTab from "./InfoTab";
import { Avatar } from "@mui/material";
import Image from "next/image";



interface Props {

	post?: any[],

}


const SwipableMenu: React.FC<Props> = ({ post }) => {

	const [open, setOpen] = React.useState(false)

	return (
		<>
			<Avatar className="menu" onClick={() => setOpen(true)}>
				<Image alt="Paolo Minopoli" src="https://paolominopoli.vercel.app/avatar-paolo.png" layout="fill" />
			</Avatar>
			<SwipeableDrawer
				className="menu-swipe"
				anchor="left"
				open={open}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
			>
				<div
					onClick={() => setOpen(false)}
					className="close-menu">
					<ArrowCircleLeftOutlinedIcon
						sx={{ color: "#fff", fontSize: 35 }}
						className="menu"
						onClick={() => setOpen(true)}
					></ArrowCircleLeftOutlinedIcon ></div>
				<span style={{ marginTop: "20px" }}></span>
				<InfoTab></InfoTab>
			</SwipeableDrawer>

		</>
	);
}



export default SwipableMenu;