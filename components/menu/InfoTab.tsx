import { Avatar } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { info} from "../../posts/posts"

import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import Logo from "./Logo"

interface Props {


}
const InfoTab: React.FC<Props> = ({ }) => {


    const infos = info.text
    const social:any = info.social


    return <div
        className="infoTab" >
        <div className="avatar-container">

            <Avatar >
                <Image alt="Paolo Minopoli" src="https://paolominopoli.com/avatar-paolo.png" layout="fill" />
            </Avatar>
        </div>
        <span style={{ marginTop: "10px" ,zIndex:"10"}}> <Logo ></Logo></span>
        <div style={{ display: "flex",  marginTop: "10px" }}>

            <Link  href={social['instagram']} >
                <InstagramIcon className="social-link-icon"  />
            </Link>
            <Link  href={social['linkedin']}>
                <LinkedInIcon className="social-link-icon" ></LinkedInIcon>
            </Link>
            <Link   href={social['gmail']}>
                <MailOutlineRoundedIcon className="social-link-icon" ></MailOutlineRoundedIcon>
            </Link>
        </div>


        <div style={{ padding: "18px", marginTop: "0px" }} className='post-content-container' >{infos.map((el,i)=> <p key={i}>{el}</p>)}</div>

    </div>
}

export default InfoTab