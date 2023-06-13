import Link from "next/link"

import SwipableMenu from "./menu/SwipableMenu"

import Logo from "./menu/Logo"
import { Avatar } from "@mui/material"
import Image from "next/image"
import { useAppSelector } from "../store/hooks"
import { cartSelector } from "../store/cart.slice"
import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';



const Footer: React.FC = ({ }) => {

  const { info } = useAppSelector(cartSelector)


  return <footer className="footer">
    <div className="footer-logo-block">
    <div className="avatar-container">

<Avatar >
  <Image alt="Paolo Minopoli" src="https://paolominopoli.vercel.app/avatar-paolo.png" layout="fill" />
</Avatar>
</div>
<span style={{ marginTop: "10px",zIndex:"10" }}> <Logo ></Logo></span>
<div style={{ display: "flex", marginTop: "10px" }}>

<Link href={info[0]?.acf.instagram ? info[0]?.acf.instagram : "/"} >
  <InstagramIcon className="social-link-icon" />
</Link>
<Link href={info[0]?.acf.linkedin ? info[0]?.acf.linkedin : "/"}>
  <LinkedInIcon className="social-link-icon" ></LinkedInIcon>
</Link>
<Link href={info[0]?.acf.email ? info[0]?.acf.email : "/"}>
  <MailOutlineRoundedIcon className="social-link-icon" ></MailOutlineRoundedIcon>
</Link>
</div>
    </div>
  
    <p
      style={{
        color: "#fff",
        fontSize: "12px",
        fontFamily:
          "-apple-system, system-ui, BlinkMacSystemFont, Segoe U, Roboto, Helvetica Neue, Arial, sans-serif",
        textTransform: "capitalize",
        fontWeight: "bold",
        marginTop: "30px",
      }}
    >
      {" "}
      Copyright © PAOLO MINOPOLI All Right Reserved.{" "}

    </p>
    <p
      style={{
        color: "#fff",
        fontSize: "12px",
        fontFamily:
          "-apple-system, system-ui, BlinkMacSystemFont, Segoe U, Roboto, Helvetica Neue, Arial, sans-serif",
        fontWeight: "bold",
      }}
    >paolo.minopoli@gmail.com </p>

    <div style={{ marginBottom: '30px', fontSize: '0.9em' }}>

      <Link href="/privacy-policy"><span style={{ cursor: "pointer", color: '#008069', fontWeight: "bold", }}  >Cookies e Privacy Policy </span></Link>

    </div>
  </footer>
}

export default Footer