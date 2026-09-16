import Chat from "./Chat"
import InfoTab from "./menu/InfoTab"

const Sidebar = (): JSX.Element => (
  <header className="sidebar">
    <InfoTab />
    <Chat />
  </header>
)

export default Sidebar